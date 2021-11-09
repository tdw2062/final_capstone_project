const knex = require("../db/connection");

function list() {
  return knex("reservations").select("*");
}

//List all movies
function listTables() {
  return knex("tables").select("*");
}

module.exports = {
  list,
  listTables,
};
