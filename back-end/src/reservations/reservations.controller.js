/**
 * List handler for reservation resources
 */

const reservationsService = require("./reservations.service.js");

async function list(req, res, next) {
  const data = await reservationsService.list();
  res.json({ data });
}

module.exports = {
  list,
};
