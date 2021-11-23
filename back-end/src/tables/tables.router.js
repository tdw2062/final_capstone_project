/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/new").post(controller.createTable).all(methodNotAllowed);

router
  .route("/:tableId/seat")
  .delete(controller.update)
  .put(controller.update)
  .all(methodNotAllowed);

router.route("/:tableId").get(controller.read).all(methodNotAllowed);

router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
