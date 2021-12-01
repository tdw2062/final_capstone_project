/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//Route to create a new table
router.route("/new").post(controller.createTable).all(methodNotAllowed);

//Route to update a table
router
  .route("/:tableId/seat")
  .delete(controller.updateTableStatus)
  .put(controller.update)
  .all(methodNotAllowed);

//Route to get a specific table
router.route("/:tableId").get(controller.read).all(methodNotAllowed);

//Route to list all tables
router
  .route("/")
  .get(controller.list)
  .post(controller.createTable)
  .all(methodNotAllowed);

module.exports = router;
