const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */

const tablesService = require("./tables.service.js");

//Make sure that the reservation date is not in the past, is not a Tuesday, and is not before 10AM or after 9:30PM
async function validateBody(body, next) {
  console.log("Request body received", body);

  if (
    !body ||
    !body.table_name ||
    body.table_name.trim() === "" ||
    body.table_name.length === 1
  ) {
    next({
      status: 400,
      message: "The table_name did not pass validation.",
    });
  } else if (
    !body.capacity ||
    body.capacity === 0 ||
    isNaN(body.capacity) ||
    typeof body.capacity === "string"
  ) {
    console.log("Capacity was failed");
    next({
      status: 400,
      message: "The capacity did not pass validation.",
    });
  }
}

//Create a table based on the request body data
async function createTable(req, res, next) {
  console.log("request data", req.body);
  validateBody(req.body.data, next);
  const data = await tablesService.createTable(req.body.data);
  console.log("back-end data", data);
  res.status(201).json({ data });
}

//Helper function that determines if a given reservation exists (by reservationId)
async function tableExists(req, res, next) {
  const table = await tablesService.read(req.params.tableId);
  console.log("tableFound", table);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${req.params.tableId} cannot be found.`,
  });
}

//List all of the tables
async function list(req, res, next) {
  const data = await tablesService.list();
  console.log("list of tables", data);
  res.json({ data });
}

//List a specific table based on tableId in url
async function read(req, res, next) {
  res.json({ data: res.locals.table });
}

//Update a table, first making sure that reservation_id is not null (the table is occupied)
async function update(req, res, next) {
  const data = await tablesService.list();
  console.log("tables fullList", data);
  console.log("seatRequestData", req.body.data);

  //Make sure a reservation_id is present
  if (!req.body.data || !req.body.data.reservation_id) {
    next({
      status: 400,
      message: `The request body should contain a reservation_id.`,
    });
  }

  //Make sure the reservation_id exists
  const reservation = await tablesService.readReservation(
    req.body.data.reservation_id
  );
  console.log("reservation before update", reservation);

  if (!reservation) {
    next({
      status: 404,
      message: `The reservation_id ${req.body.data.reservation_id} cannot be found.`,
    });
  }

  //Grab the table to run validateCapacity
  const table = await tablesService.read(req.params.tableId);
  console.log("table before update", table);

  validateCapacity(
    reservation.people,
    table.capacity,
    table.reservation_id,
    next
  );

  //Make sure the reservation is not already seated
  if (reservation.status === "seated") {
    next({
      status: 400,
      message: `The reservation_id is already seated.`,
    });
  }

  let objUpdate = { status: "seated" };
  await updateReservation(objUpdate, reservation.reservation_id);

  const response = await tablesService.update(
    req.body.data,
    req.params.tableId
  );
  res.json({ data: response });
}

//Make sure that the table has sufficient capacity
async function validateCapacity(people, capacity, reservation_id, next) {
  console.log("fromTables");
  //Check that capacity is sufficient for the number of people
  console.log(
    "people",
    people,
    "capacity",
    capacity,
    "reservation_id",
    reservation_id
  );
  if (people > capacity || reservation_id !== null) {
    console.log("400 error");
    next({
      status: 400,
      message:
        "The table must have sufficient capacity to seat the party and it must not be occupied.",
    });
  }
}

async function updateTableStatus(req, res, next) {
  const record = res.locals.table;
  console.log("thisRecord", record);
  console.log("requestBody", req.body.data);
  if (record.reservation_id === null) {
    next({
      status: 400,
      message: `Table is not occupied (reservation_id is null).`,
    });
  }
  //If no request body is given, set reservation_id to null
  let requestBody = null;
  if (!req.body.data) {
    requestBody = { reservation_id: null };
  } else {
    requestBody = req.body.data;
  }

  let objUpdate = { status: "finished" };
  await updateReservation(objUpdate, record.reservation_id);

  //Update the table in the DB
  const response = await tablesService.update(requestBody, req.params.tableId);
  res.json({ data: response });
}

//Modify the table but make sure there is valid capacity first
async function updateReservation(objUpdate, reservation_id) {
  //Update the reservation
  await tablesService.updateReservation(objUpdate, reservation_id);
}

module.exports = {
  createTable: asyncErrorBoundary(createTable),
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  update: asyncErrorBoundary(update),
  updateTableStatus: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(updateTableStatus),
  ],
};
