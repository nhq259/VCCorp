const db = require("../../../models/index");

const productService = {
  // Lấy danh sách sản phẩm (chưa xóa)
  list: async () => {
    return await db.Product.findAll({
      where: { deleted: false }
    });
  },

  // Lấy chi tiết sản phẩm
  detail: async (id) => {
    return await db.Product.findOne({
      where: { id, deleted: false }
    });
  },

  // Tạo sản phẩm mới
  create: async (payload) => {
    return await db.Product.create(payload);
  },

  update: async (id, payload) => {
    const product = await db.Product.findByPk(id);
    if (!product) throw new Error('Product not found');

    Object.assign(product, payload);

    await product.save(); 
    return product;
  },

  // Xóa mềm
  softDelete: async (id) => {
    return await db.Product.update(
      { deleted: true },
      { where: { id } }
    );
  }
};

module.exports = productService;
