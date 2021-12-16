/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//Route to edit a reservation
router
  .route("/:reservationId/edit")
  .put(controller.update)
  .all(methodNotAllowed);

//Route to seat one reservation
router
  .route("/:reservationId/seat")
  .get(controller.listTables)
  .post(controller.createTable)
  .all(methodNotAllowed);

//Route to update the status of a table
router
  .route("/:reservationId/status")
  .put(controller.updateStatus)
  .all(methodNotAllowed);

//Route to get a specific table
router
  .route("/:reservationId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

//Route to list all tables or create a new table
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
