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

module.exports = {
  list,
  listTables,
};
