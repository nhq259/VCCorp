require("express-router-group");
const express = require("express");
const middlewares = require("kernels/middlewares");
const { validate } = require("kernels/validations");
const exampleController = require("modules/examples/controllers/exampleController");
const productController = require("modules/products/controllers/productController");

// validations
const {
  createProductValidation,
  updateProductValidation,
} = require("modules/products/validations/productValidation");

const router = express.Router({ mergeParams: true });

// ===== EXAMPLE Request, make this commented =====
// router.group("/posts",middlewares([authenticated, role("owner")]),(router) => {
//   router.post("/create",validate([createPostRequest]),postsController.create);
//   router.put("/update/:postId",validate([updatePostRequest]),postsController.update);
//   router.delete("/delete/:postId", postsController.destroy);
// }
// );

router.group("/example", validate([]), (router) => {
  router.get("/", exampleController.exampleRequest);
});

router.group("/admin/products", validate([]), (router) => {
  router.get("/", productController.index);
  router.get("/:id", productController.detail);
  router.post("/create", productController.create);
  router.patch("/update/:id", productController.update);
  router.delete("/delete/:id", productController.delete);
});

module.exports = router;
