const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

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

  const response = await reservationsService.list(req.query);
  console.log("initial response", response);
  const data = response.filter((obj) => obj.status !== "finished");
  console.log("filtered response", data);
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

//Make sure that the reservation date is not in the past and that the day of the reservation is not a Tuesday
async function validateDate(date, next) {
  //Create date for reservation date
  console.log("type of for date", typeof date);

  let month = Number(date.substring(5, 7)) - 1;
  let day = Number(date.substring(8, 10));
  let year = Number(date.substring(0, 4));
  let resDate = new Date(year, month, day);

  //Create date for today to compare to resDate
  let today = new Date();

  //Check if reservation day is in the past or is a Tuesday
  if (resDate.getDay() === 2 || resDate < today) {
    next({
      status: 400,
      message:
        "The date given cannot be in the past and cannot be on a Tuesday.",
    });
  }
}

//List a specific reservation
async function read(req, res, next) {
  res.json({ data: res.locals.reservation });
}

async function create(req, res, next) {
  console.log("request data", req.body);
  let date = req.body.data.reservation_date;
  validateDate(date, next);
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

//Make sure that the table has sufficient capacity
async function validateCapacity(people, capacity, next) {
  //Check that capacity is sufficient for the number of people
  if (people > capacity) {
    next({
      status: 400,
      message: "The table must have sufficient capacity to seat the party.",
    });
  }
}

async function updateWithValidation(req, res, next) {
  //Set the reservation
  let reservation = res.locals.reservation;
  const table = await reservationsService.readTable(req.params.tableId);
  console.log("tableCapacity", table.capacity);

  validateCapacity(reservation.people, table.capacity, next);

  const response = await reservationsService.update(
    req.body.data,
    req.params.reservationId
  );
  res.json({ data: response });
}

module.exports = {
  list: asyncErrorBoundary(list),

  listTables: asyncErrorBoundary(listTables),
  create: asyncErrorBoundary(create),
  createTable: asyncErrorBoundary(createTable),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: asyncErrorBoundary(update),
  updateWithValidation: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateWithValidation),
  ],
};
