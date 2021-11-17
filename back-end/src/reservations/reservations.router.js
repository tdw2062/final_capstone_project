/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/:reservationId/edit")
  .put(controller.update)
  .all(methodNotAllowed);

router
  .route("/:reservationId/seat")
  .get(controller.listTables)
  .post(controller.createTable)
  .all(methodNotAllowed);

router
  .route("/:reservationId/status")
  .put(controller.update)
  .all(methodNotAllowed);

router.route("/:reservationId").get(controller.read).all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
