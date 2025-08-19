// const { Op } = require('sequelize');
// const db = require('models/index');
// const Product = db.Product;

// function buildQuery({ page = 1, limit = 10, search = '', status, sort = 'position:desc' }) {
//   page = +page || 1;
//   limit = +limit || 10;

//   const where = {};
//   if (status) where.status = status;
//   if (search) where.name = { [Op.like]: `%${search}%` };

//   const [field, dir = 'desc'] = String(sort).split(':');
//   const order = field ? [[field, dir.toUpperCase()]] : [['position', 'DESC']];

//   return { where, order, page, limit, offset: (page - 1) * limit };
// }

// async function list(query) {
//   const { where, order, limit, offset, page } = buildQuery(query);
//   const { rows, count } = await Product.findAndCountAll({ where, order, limit, offset });
//   return { data: rows, meta: { page, limit, total: count } };
// }

// async function getById(id) {
//   return Product.findByPk(id);
// }

// async function create(payload) {
//   const { name, price, categoryId, thumbnail, status = 'active', position = 0 } = payload;
//   return Product.create({ name, price, categoryId, thumbnail, status, position });
// }

// async function update(id, payload) {
//   const item = await Product.findByPk(id);
//   if (!item) return null;
//   const { name, price, categoryId, thumbnail, status, position } = payload;
//   await item.update({ name, price, categoryId, thumbnail, status, position });
//   return item;
// }

// async function destroy(id) {
//   const item = await Product.findByPk(id);
//   if (!item) return 0;
//   await item.destroy();
//   return 1;
// }

// // giữ API quen thuộc
// async function changeStatus(id, status) {
//   const item = await Product.findByPk(id);
//   if (!item) return null;
//   await item.update({ status });
//   return item;
// }

// async function changeMulti({ action, ids = [], value }) {
//   if (!Array.isArray(ids) || ids.length === 0) return { affected: 0 };

//   if (action === 'delete') {
//     const affected = await Product.destroy({ where: { id: ids } });
//     return { affected };
//   }

//   if (action === 'status') {
//     const [affected] = await Product.update({ status: value }, { where: { id: ids } });
//     return { affected };
//   }

//   return { affected: 0 };
// }

// module.exports = {
//   list,
//   getById,
//   create,
//   update,
//   destroy,
//   changeStatus,
//   changeMulti,
// };
