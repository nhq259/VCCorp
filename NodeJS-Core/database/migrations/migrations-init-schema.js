'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) ROLES
    await queryInterface.createTable('role', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      permissions: Sequelize.TEXT, // JSON string
      deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('role', ['deleted']);

    // 2) ACCOUNTS
    await queryInterface.createTable('account', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      full_name: Sequelize.STRING,
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: Sequelize.STRING,
      token: Sequelize.STRING,
      phone: Sequelize.STRING,
      avatar: Sequelize.STRING,
      role_id: {
        type: Sequelize.INTEGER,
        references: { model: 'role', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      status: Sequelize.STRING,
      deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('account', ['role_id']);

    // 3) USERS
    await queryInterface.createTable('user', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      full_name: Sequelize.STRING,
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: Sequelize.STRING,
      token_user: Sequelize.STRING,
      phone: Sequelize.STRING,
      avatar: Sequelize.STRING,
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'active' },
      status_online: Sequelize.STRING,
      deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('user', ['status']);

    // 4) PRODUCT CATEGORIES
    await queryInterface.createTable('product_category', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: Sequelize.STRING,
      parent_id: {
        type: Sequelize.INTEGER,
        references: { model: 'product_category', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      description: Sequelize.STRING,
      thumbnail: Sequelize.STRING,
      status: Sequelize.STRING,
      position: Sequelize.INTEGER,
      slug: { type: Sequelize.STRING, unique: true },
      deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('product_category', ['parent_id']);

    // 5) PRODUCTS
    await queryInterface.createTable('product', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: Sequelize.STRING,
      product_category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'product_category', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      description: Sequelize.STRING,
      price: Sequelize.DECIMAL(10, 2),
      discount_percentage: Sequelize.DECIMAL(5, 2),
      stock: Sequelize.INTEGER,
      thumbnail: Sequelize.STRING,
      status: Sequelize.STRING,
      featured: Sequelize.STRING,
      position: Sequelize.INTEGER,
      slug: { type: Sequelize.STRING, unique: true },
      deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('product', ['product_category_id']);
    await queryInterface.addIndex('product', ['status', 'featured']);

    // 6) CARTS
    await queryInterface.createTable('cart', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    // Mỗi user 1 cart đang hoạt động
    await queryInterface.addConstraint('cart', {
      fields: ['user_id'],
      type: 'unique',
      name: 'uq_cart_user',
    });

    // 7) CART ITEMS
    await queryInterface.createTable('cart_item', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cart', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'product', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // giữ sản phẩm đã có trong giỏ? tùy bạn
      },
      quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addConstraint('cart_item', {
      fields: ['cart_id', 'product_id'],
      type: 'unique',
      name: 'uq_cart_item_cart_product',
    });

    // 8) CHATS
    await queryInterface.createTable('chat', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'account', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      content: Sequelize.TEXT,
      images: Sequelize.TEXT, // có thể là JSON string
      deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('chat', ['user_id', 'admin_id', 'deleted']);

    // 9) FORGOT PASSWORD
    await queryInterface.createTable('forgot_password', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      email: Sequelize.STRING,
      otp: Sequelize.STRING,
      expire_at: Sequelize.DATE,
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('forgot_password', ['email', 'expire_at']);

    // 10) VOUCHER
    await queryInterface.createTable('voucher', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      discount_type: Sequelize.STRING(20), // percent | fixed
      discount_value: Sequelize.DECIMAL(10, 2),
      start_date: Sequelize.DATE,
      end_date: Sequelize.DATE,
      usage_limit: Sequelize.INTEGER,
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('voucher', ['start_date', 'end_date']);

    // 11) SHIPPING METHOD
    await queryInterface.createTable('shipping_method', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      description: Sequelize.TEXT,
      cost: Sequelize.DECIMAL(10, 2),
      estimated_days: Sequelize.INTEGER,
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    // 12) ORDERS
    await queryInterface.createTable('order', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      cart_id: {
        type: Sequelize.INTEGER,
        references: { model: 'cart', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      full_name: Sequelize.STRING,
      phone: Sequelize.STRING,
      address: Sequelize.STRING,
      voucher_id: {
        type: Sequelize.INTEGER,
        references: { model: 'voucher', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      shipping_method_id: {
        type: Sequelize.INTEGER,
        references: { model: 'shipping_method', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('order', ['cart_id', 'voucher_id', 'shipping_method_id']);

    // 13) ORDER ITEMS
    await queryInterface.createTable('order_item', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'order', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'product', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // giữ lịch sử
      },
      price: Sequelize.DECIMAL(10, 2),
      discount_percentage: Sequelize.DECIMAL(5, 2),
      quantity: Sequelize.INTEGER,
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('order_item', ['order_id']);
    await queryInterface.addIndex('order_item', ['product_id']);

    // 14) POSTS
    await queryInterface.createTable('post', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: Sequelize.STRING,
      content: Sequelize.TEXT,
      image_url: Sequelize.STRING,
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'published' },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'account', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('post', ['status', 'admin_id']);

    // 15) STATISTIC
    await queryInterface.createTable('statistic', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      date: { type: Sequelize.DATEONLY, allowNull: false, unique: true },
      total_orders: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_revenue: { type: Sequelize.DECIMAL(15, 2), defaultValue: 0.00 },
      total_profit: { type: Sequelize.DECIMAL(15, 2), defaultValue: 0.00 },
      total_stock: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    // 16) REVIEWS
    await queryInterface.createTable('review', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // xóa user → xóa review
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'product', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // xóa product → xóa review
      },
      rating: { type: Sequelize.INTEGER, allowNull: false }, // 1..5 (validate ở model)
      comment: Sequelize.TEXT,
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    // 1 user chỉ review 1 lần / product (nếu muốn)
    await queryInterface.addConstraint('review', {
      fields: ['user_id', 'product_id'],
      type: 'unique',
      name: 'uq_review_user_product',
    });

    // 17) SETTING GENERAL
    await queryInterface.createTable('setting_general', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      website_name: Sequelize.STRING,
      logo: Sequelize.STRING,
      phone: Sequelize.STRING,
      email: Sequelize.STRING,
      address: Sequelize.STRING,
      copyright: Sequelize.STRING,
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface/*, Sequelize*/) {
    // Drop theo thứ tự ngược quan hệ
    await queryInterface.dropTable('setting_general');
    await queryInterface.dropTable('review');
    await queryInterface.dropTable('statistic');
    await queryInterface.dropTable('post');
    await queryInterface.dropTable('order_item');
    await queryInterface.dropTable('order');
    await queryInterface.dropTable('shipping_method');
    await queryInterface.dropTable('voucher');
    await queryInterface.dropTable('forgot_password');
    await queryInterface.dropTable('chat');
    await queryInterface.dropTable('cart_item');
    await queryInterface.dropTable('cart');
    await queryInterface.dropTable('product');
    await queryInterface.dropTable('product_category');
    await queryInterface.dropTable('user');
    await queryInterface.dropTable('account');
    await queryInterface.dropTable('role');
  }
};
