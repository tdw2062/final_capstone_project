const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */

const tablesService = require("./tables.service.js");

async function createTable(req, res, next) {
  console.log("request data", req.body);
  const data = await tablesService.createTable(req.body.data);
  console.log("back-end data", data);
  res.status(201).json({ data });
}

async function list(req, res, next) {
  const data = await tablesService.list();
  res.json({ data });
}

//List a specific table
async function read(req, res, next) {
  const response = await tablesService.read(req.params.tableId);
  res.json({ data: response });
}

async function create(req, res, next) {
  console.log("request data", req.body);
  const data = await tablesService.create(req.body.data);
  console.log("back-end data", data);
  res.status(201).json({ data });
}

async function update(req, res, next) {
  const response = await tablesService.update(
    req.body.data,
    req.params.tableId
  );
  res.json({ data: response });
}

module.exports = {
  createTable: asyncErrorBoundary(createTable),
  list: asyncErrorBoundary(list),
  read: asyncErrorBoundary(read),
  update: asyncErrorBoundary(update),
};
