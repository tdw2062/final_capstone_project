const { bindComplete } = require("pg-protocol/dist/messages");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */

const reservationsService = require("./reservations.service.js");

//Lists all of the tables
async function listTables(req, res, next) {
  const data = await reservationsService.listTables();
  res.json({ data });
}

//List all of the reservations
async function list(req, res, next) {
  //Get reservations filtered by the paramater in the query string (usually 'date')

  const params = req.query;
  console.log("params", params);
  if (params["date"]) {
    params.reservation_date = params.date;
    delete params["date"];
  }
  const response = await reservationsService.list(params);
  console.log("initial response", response);
  //Only return reservations with a status of 'finished'
  const data = response.filter((obj) => obj.status !== "finished");
  console.log("filtered response", data);
  res.json({ data });
}

//Helper function that determines if a given reservation exists (by reservationId)
async function reservationExists(req, res, next) {
  const reservation = await reservationsService.read(req.params.reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservationId} cannot be found.`,
  });
}

//Make sure that the reservation date is not in the past, is not a Tuesday, and is not before 10AM or after 9:30PM
async function validateDate(date, time, next) {
  //Create date for reservation date
  let month = Number(date.substring(5, 7)) - 1;
  let day = Number(date.substring(8, 10));
  let year = Number(date.substring(0, 4));
  let hours = Number(time.substring(0, 2));
  let minutes = Number(time.substring(3, 5));

  console.log("extractedHours", hours, "extractedMinutes", minutes);

  //Create a new reservation date based on the date being passed in from the request body (on the 'create' function)
  let resDate = new Date(year, month, day);
  resDate.setHours(hours);
  resDate.setMinutes(minutes);

  console.log("Reservation Date/Time", resDate);

  //Create date for today to compare to resDate
  let today = new Date();

  //First, check to make sure it is a date
  if (!(resDate instanceof Date) || isNaN(resDate)) {
    next({
      status: 400,
      message: "The reservation_date or reservation_time was invalid.",
    });
  }

  //Check if reservation day is in the past or is a Tuesday
  if (resDate.getDay() === 2 || resDate.valueOf() < today.valueOf()) {
    next({
      status: 400,
      message:
        "The date given must be a future date and it cannot be on a Tuesday because the restaurant is closed on this day.",
    });
  }

  //Check if the reservation is before 10:30 AM
  if (
    resDate.getHours() < 10 ||
    (resDate.getHours() === 10 && resDate.getMinutes() < 30)
  ) {
    next({
      status: 400,
      message: "The reservation time cannot be before 10:30AM or after 9:30PM.",
    });
  }

  //Check if the reservation is after 9:30PM
  if (
    resDate.getHours() > 21 ||
    (resDate.getHours() === 21 && resDate.getMinutes() > 30)
  ) {
    next({
      status: 400,
      message: "The reservation time cannot be before 10:30AM or after 9:30PM.",
    });
  }
}

//List a specific reservation (after passing through reservationExists function)
async function read(req, res, next) {
  res.json({ data: res.locals.reservation });
}

//Create a new reservation (use valideDate to make sure time/date are valid)
async function create(req, res, next) {
  validateBody(req.body.data, next);
  if (
    !req.body.data.reservation_date ||
    req.body.data.reservation_date.trim() === ""
  ) {
    next({
      status: 400,
      message: "The reservation_date did not pass validation.",
    });
  }
  if (
    !req.body.data.reservation_time ||
    req.body.data.reservation_time.trim() === ""
  ) {
    next({
      status: 400,
      message: "The reservation_time did not pass validation.",
    });
  }
  //Get the time and date from the request body
  let date = req.body.data.reservation_date;
  let time = req.body.data.reservation_time;
  //Validate the time and date and then create a new reservation based on request body
  if (date && time) validateDate(date, time, next);

  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

//Make sure that the reservation date is not in the past, is not a Tuesday, and is not before 10AM or after 9:30PM
async function validateBody(body, next) {
  console.log("Request body received", body);
  if (!body || !body.first_name || body.first_name.trim() === "") {
    next({
      status: 400,
      message: "The first_name did not pass validation.",
    });
  } else if (!body.last_name || body.last_name.trim() === "") {
    next({
      status: 400,
      message: "The last_name did not pass validation.",
    });
  } else if (!body.mobile_number || body.mobile_number.trim() === "") {
    next({
      status: 400,
      message: "The mobile_number did not pass validation.",
    });
  } else if (
    !body.people ||
    body.people === 0 ||
    isNaN(body.people) ||
    typeof body.people === "string"
  ) {
    next({
      status: 400,
      message: "The people did not pass validation.",
    });
  }
}

//Create a new table based on the request body
async function createTable(req, res, next) {
  const data = await reservationsService.createTable(req.body.data);
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
async function validateCapacity(people, capacity, reservation_id, next) {
  //Check that capacity is sufficient for the number of people
  if (people > capacity || reservation_id !== null) {
    console.log("400 error");
    next({
      status: 400,
      message:
        "The table must have sufficient capacity to seat the party and it must not be occupied.",
    });
  }
}

//Modify the table but make sure there is valid capacity first
async function updateWithValidation(req, res, next) {
  //Set the reservation (from reservationExists function)
  let reservation = res.locals.reservation;
  //Get the specific table based on the tableId in url
  const table = await reservationsService.readTable(req.params.tableId);
  console.log("tableCapacity", table.capacity);

  validateCapacity(
    reservation.people,
    table.capacity,
    table.reservation_id,
    next
  );

  //Update the reservation
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
