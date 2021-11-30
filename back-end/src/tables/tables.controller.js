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
  res.json({ data });
}

//List a specific table based on tableId in url
async function read(req, res, next) {
  res.json({ data: res.locals.table });
}

//Update a table, first making sure that reservation_id is not null (the table is occupied)
async function update(req, res, next) {
  const record = await tablesService.read(req.params.tableId);
  console.log("thisRecord", record);
  if (record.reservation_id === null) {
    next({
      status: 400,
      message: `Table is not occupied (reservation_id is null).`,
    });
  }

  const response = await tablesService.update(
    req.body.data,
    req.params.tableId
  );
  res.json({ data: response });
}

module.exports = {
  createTable: asyncErrorBoundary(createTable),
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  update: asyncErrorBoundary(update),
};
