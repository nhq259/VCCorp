
'use strict';
const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define('ProductCategory', {
    title: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    status: DataTypes.STRING,
    position: DataTypes.INTEGER,
    slug: DataTypes.STRING, // để trống khi tạo, plugin sẽ tự sinh
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'product_category', timestamps: true });

  // Tự sinh slug từ title, đảm bảo duy nhất toàn bảng
  SequelizeSlugify.slugifyModel(ProductCategory, {
    source: ['title'],
    column: 'slug',
    slugOptions: { lower: true, strict: true, replacement: '-' },
    overwrite: false, // đổi thành true nếu muốn cập nhật slug khi đổi title
  });

  // Nếu client gửi slug: "" (chuỗi rỗng) → cho về null để plugin tự tạo
  ProductCategory.addHook('beforeValidate', (cat) => {
    if (cat.slug === '') cat.slug = null;
  });

  ProductCategory.associate = (models) => {
    ProductCategory.belongsTo(models.ProductCategory, { foreignKey: 'parent_id', as: 'parent' });
    ProductCategory.hasMany(models.ProductCategory, { foreignKey: 'parent_id', as: 'children' });
    ProductCategory.hasMany(models.Product, { foreignKey: 'product_category_id', as: 'products' });
  };

  return ProductCategory;
};
