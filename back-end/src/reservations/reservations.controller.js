/**
 * List handler for reservation resources
 */

const reservationsService = require("./reservations.service.js");

//Lists all of the theters
async function listTables(req, res, next) {
  const data = await reservationsService.listTables();
  res.json({ data });
}

async function list(req, res, next) {
  console.log("params", req.query);
  const data = await reservationsService.list(req.query);

  res.json({ data });
}

//Helper function that determines if a given reservation exits (by reservationId)
async function reservationExists(req, res, next) {
  const reservation = await reservationsService.read(req.params.reservationId);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation cannot be found.` });
}

//List a specific reservation
async function read(req, res, next) {
  res.json({ data: res.locals.reservation });
}

async function create(req, res, next) {
  console.log("request data", req.body);
  const data = await reservationsService.create(req.body.data);
  console.log("back-end data", data);
  res.status(201).json({ data });
}

async function createTable(req, res, next) {
  console.log("request data", req.body);
  const data = await reservationsService.createTable(req.body.data);
  console.log("back-end data", data);
  res.status(201).json({ data });
}

async function update(req, res, next) {
  const response = await reservationsService.update(
    req.body.data,
    req.params.reservationId
  );
  res.json({ data: response });
}

module.exports = {
  list,
  listTables,
  create,
  createTable,
  read: [reservationExists, read],

  update,
};
