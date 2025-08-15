const { BodyWithLocale, ParamWithLocale } = require("kernels/rules");
const db = require("models/index");
const Product = db.Product;

const productValidation = {
  create: [
    new BodyWithLocale("name")
      .notEmpty()
      .isString()
      .maxLength(255)
      .unique(Product, "name"),

    new BodyWithLocale("price")
      .notEmpty()
      .isFloat({ min: 0 }),

    new BodyWithLocale("categoryId")
      .notEmpty()
      .isInt({ min: 1 }),

    new BodyWithLocale("status")
      .optional()
      .isIn(["active", "inactive", "draft"]),

    new BodyWithLocale("description")
      .optional()
      .maxLength(2000)
  ],

  update: [
    new ParamWithLocale("id")
      .isInt({ min: 1 }),

    new BodyWithLocale("name")
      .optional()
      .isString()
      .maxLength(255),

    new BodyWithLocale("price")
      .optional()
      .isFloat({ min: 0 }),

    new BodyWithLocale("categoryId")
      .optional()
      .isInt({ min: 1 }),

    new BodyWithLocale("status")
      .optional()
      .isIn(["active", "inactive", "draft"]),

    new BodyWithLocale("description")
      .optional()
      .maxLength(2000)
  ]
};

module.exports = productValidation;
