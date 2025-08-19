const responseUtils = require('utils/responseUtils');
const  {normalizeProduct}  = require('utils/serializers');

const { Op } = require('sequelize');
const db = require('models'); 

// [GET] /admin/products
module.exports.index = async (req, res)=> {
    try {
      const page  = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
      const offset = (page - 1) * limit;

      const where = { deleted: false };
      if (req.query.q) where.title = { [Op.like]: `%${req.query.q}%` };
      if (req.query.status) where.status = req.query.status;

      const allow = ['createdAt', 'price', 'title', 'position', 'status'];
      const sort = req.query.sort || '-createdAt';
      const dir = sort.startsWith('-') ? 'DESC' : 'ASC';
      const field = sort.replace(/^-/, '');
      const order = allow.includes(field) ? [[field, dir]] : [['createdAt', 'DESC']];

      const { rows, count } = await db.Product.findAndCountAll({
        where, limit, offset, order,
      });

      const items = rows.map(normalizeProduct); // <- ép kiểu tại đây

      return responseUtils.success(res, {
        data: items,
        meta: { page, limit, total: count, totalPages: Math.max(1, Math.ceil(count / limit)) }
      });
    } catch (err) {
      return responseUtils.error(res, err.message || 'Internal Server Error');
    }
  };

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  const toNumber = (v) => (v === undefined || v === null || v === '' ? null : Number(v));
  const toInt = (v, def = 0) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? def : n;
  };

  try {
    // Map & ép kiểu input
    const payload = {
      title: (req.body.title || '').trim(),
      product_category_id: toInt(req.body.product_category_id, null),
      description: req.body.description || null,
      price: toNumber(req.body.price),
      // chấp nhận cả discount_percentage & discountPercentage từ FE
      discount_percentage: toNumber(req.body.discount_percentage ?? req.body.discountPercentage),
      stock: toInt(req.body.stock, 0),
      status: req.body.status || 'active',
      featured: req.body.featured || 'no',
      thumbnail: null, // set bên dưới nếu có file
      deleted: false,
    };

    // Tính position: nếu không gửi hoặc gửi rỗng, lấy max(position)+1
    let position = req.body.position;
    if (position === '' || position === undefined || position === null) {
      const maxPos = await db.Product.max('position', { where: { deleted: false } });
      position = (Number.isFinite(maxPos) ? maxPos : 0) + 1;
    } else {
      position = toInt(position, 1);
    }
    payload.position = position;

    // Ảnh: ưu tiên uploadCloud (middleware gán req.fileUrl), fallback multer local
    if (req.file && req.fileUrl) {
      payload.thumbnail = req.fileUrl;
    } else if (req.file && req.file.filename) {
      payload.thumbnail = `/uploads/${req.file.filename}`;
    }

    // Không cho client set slug – để plugin sequelize-slugify tự sinh
    delete payload.slug;

    // Validate tối thiểu
    if (!payload.title) return responseUtils.badRequest(res, 'title is required');
    if (payload.price === null) return responseUtils.badRequest(res, 'price is required');

    // Tạo record (hooks sẽ chạy để sinh slug)
    const row = await db.Product.create(payload);

    // Trả JSON về cho FE (đã ép DECIMAL -> number)
    return res.status(201).json({ data: normalizeProduct(row) });

    // Nếu bạn vẫn dùng trang admin SSR cũ và muốn redirect:
    // return res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (err) {
    return responseUtils.error(res, err.message || 'Internal Server Error');
  }
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: { message: 'Invalid id' } });
    }

    const [affected] = await db.Product.update(
      { deleted: true /*, status: 'inactive'*/ },
      { where: { id, deleted: false } }
    );

    if (affected === 0) {
      return res.status(404).json({ error: { message: 'Product not found' } });
    }

    // Trả JSON cho FE
    return responseUtils
      ? responseUtils.success(res, { data: true })
      : res.json({ data: true });
  } catch (err) {
    return responseUtils
      ? responseUtils.error(res, err.message || 'Internal Server Error')
      : res.status(500).json({ error: { message: err.message || 'Internal Server Error' } });
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const toNumber = (v) => (v === undefined || v === null || v === '' ? null : Number(v));
  const toInt = (v, def = 0) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? def : n;
  };

  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: { message: 'Invalid id' } });
    }

    const row = await db.Product.findByPk(id);
    if (!row || row.deleted) {
      return responseUtils.notFound
        ? responseUtils.notFound(res, 'Product not found')
        : res.status(404).json({ error: { message: 'Product not found' } });
    }

    const b = req.body;
    // Map các field được phép cập nhật
    if (b.title !== undefined) row.title = String(b.title).trim();
    if (b.product_category_id !== undefined) row.product_category_id = toInt(b.product_category_id, row.product_category_id);
    if (b.description !== undefined) row.description = b.description || null;
    if (b.price !== undefined) row.price = toNumber(b.price);
    // chấp nhận cả discount_percentage & discountPercentage
    if (b.discount_percentage !== undefined || b.discountPercentage !== undefined) {
      row.discount_percentage = toNumber(b.discount_percentage ?? b.discountPercentage);
    }
    if (b.stock !== undefined) row.stock = toInt(b.stock, row.stock ?? 0);
    if (b.status !== undefined) row.status = b.status;
    if (b.featured !== undefined) row.featured = b.featured;

    // position: nếu gửi rỗng => giữ nguyên; nếu gửi số => set
    if (b.position !== undefined && b.position !== '') {
      row.position = toInt(b.position, row.position ?? 1);
    }

    // thumbnail từ upload middleware
    if (req.file && req.fileUrl) {
      row.thumbnail = req.fileUrl;
    } else if (req.file && req.file.filename) {
      row.thumbnail = `/uploads/${req.file.filename}`;
    } else if (b.thumbnail === '') {
      // cho phép clear thumbnail bằng cách gửi chuỗi rỗng
      row.thumbnail = null;
    }

    // Không cho client set slug trực tiếp
    if ('slug' in b) delete b.slug;
    // Nếu muốn ép plugin tạo lại slug khi đổi title (kể cả overwrite=false), có thể:
    if (b.title !== undefined) row.slug = null;

    await row.save(); // trigger hooks (slugify) nếu config overwrite: true

    const payload = normalizeProduct ? normalizeProduct(row) : row;
    return responseUtils && responseUtils.success
      ? responseUtils.success(res, { data: payload })
      : res.json({ data: payload });
  } catch (err) {
    return responseUtils && responseUtils.error
      ? responseUtils.error(res, err.message || 'Internal Server Error')
      : res.status(500).json({ error: { message: err.message || 'Internal Server Error' } });
  }
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: { message: 'Invalid id' } });
    }

    const row = await db.Product.findOne({
      where: { id, deleted: false },
      include: [
        { model: db.ProductCategory, as: 'category', attributes: ['id','title','slug'] }
      ]
    });

    if (!row) {
      return responseUtils?.notFound
        ? responseUtils.notFound(res, 'Product not found')
        : res.status(404).json({ error: { message: 'Product not found' } });
    }

    const data = normalizeProduct ? normalizeProduct(row) : row;
    return responseUtils?.success
      ? responseUtils.success(res, { data })
      : res.json({ data });
  } catch (err) {
    return responseUtils?.error
      ? responseUtils.error(res, err.message || 'Internal Server Error')
      : res.status(500).json({ error: { message: err.message || 'Internal Server Error' } });
  }
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = Number(req.params.id);
  const status = String(req.params.status || '').toLowerCase();
  const ALLOWED = new Set(['active','inactive']);

  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: { message: 'Invalid id' } });
  if (!ALLOWED.has(status))
    return res.status(400).json({ error: { message: 'Invalid status', allowed: [...ALLOWED] } });

  const row = await db.Product.findByPk(id);
  if (!row || row.deleted) return res.status(404).json({ error: { message: 'Product not found' } });

  if (row.status !== status) {
    row.status = status;
    await row.save();
  }
  return res.json({ data: { id: row.id, status: row.status } });
};
