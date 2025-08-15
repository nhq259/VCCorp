'use strict';
const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: DataTypes.STRING,
    product_category_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL(10,2),
    discount_percentage: DataTypes.DECIMAL(5,2),
    stock: DataTypes.INTEGER,
    thumbnail: DataTypes.STRING,
    status: DataTypes.STRING,
    featured: DataTypes.STRING,
    position: DataTypes.INTEGER,
    slug: DataTypes.STRING, // KHÔNG gửi từ client, plugin sẽ tự tạo
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'product', timestamps: true });

  // Tự sinh slug từ title
  SequelizeSlugify.slugifyModel(Product, {
    source: ['title'],
    column: 'slug',
    slugOptions: { lower: true, strict: true, replacement: '-' },
    overwrite: true, // Giữ slug ổn định khi đổi title; đổi thành true nếu muốn cập nhật slug theo title
  });

  // Nếu client lỡ gửi slug: "" (chuỗi rỗng) → chuyển thành null để plugin tự tạo
  Product.addHook('beforeValidate', (product) => {
    if (product.slug === '') product.slug = null;
  });

  Product.associate = (models) => {
    Product.belongsTo(models.ProductCategory, { foreignKey: 'product_category_id', as: 'category' });
    Product.hasMany(models.CartItem, { foreignKey: 'product_id', as: 'cartItems' });
    Product.hasMany(models.OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
    Product.hasMany(models.Review, { foreignKey: 'product_id', as: 'reviews' });
  };

  return Product;
};
