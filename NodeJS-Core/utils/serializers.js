// utils/serializers.js
const toNumber = (v) => (v === null || v === undefined ? null : Number(v));

function normalizeProduct(row) {
  // row có thể là instance Sequelize hoặc plain object
  const p = typeof row?.get === 'function' ? row.get({ plain: true }) : { ...row };

  // Ép kiểu các trường decimal
  p.price = toNumber(p.price);
  p.discount_percentage = toNumber(p.discount_percentage);

  // Clean field rỗng
  if (p.thumbnail === '') p.thumbnail = null;

  return p;
}

module.exports = { normalizeProduct, toNumber };
