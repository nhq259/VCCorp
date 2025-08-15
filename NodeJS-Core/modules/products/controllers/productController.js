const productService = require("modules/products/services/productService");
const responseUtils = require("utils/responseUtils");


const productController = {
  // Danh sách sản phẩm
  index: async (req, res) => {
    try {
      const result = await productService.list();
      return responseUtils.ok(res, { data: result });
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  // Chi tiết sản phẩm
  detail: async (req, res) => {
    try {
      const result = await productService.detail(req.params.id);
      return responseUtils.ok(res, { data: result });
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  // Tạo mới
  create: async (req, res) => {
    try {
      const result = await productService.create(req.body);
      return responseUtils.ok(res, { data: result });
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  // Cập nhật
  update: async (req, res) => {
    try {
      await productService.update(req.params.id, req.body);
      return responseUtils.ok(res, { message: "Updated successfully" });
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  },

  // Xóa mềm
  delete: async (req, res) => {
    try {
      await productService.softDelete(req.params.id);
      return responseUtils.ok(res, { message: "Deleted successfully" });
    } catch (err) {
      return responseUtils.error(res, err.message);
    }
  }
};

module.exports = productController;

