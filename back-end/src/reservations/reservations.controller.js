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
  const data = await reservationsService.list();
  res.json({ data });
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
  const response = await reservationsService.update(req.body.data);
  res.json({ data: response });
}

module.exports = {
  list,
  listTables,
  create,
  createTable,
  update,
};
