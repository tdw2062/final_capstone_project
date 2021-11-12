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

module.exports = {
  createTable,
};
