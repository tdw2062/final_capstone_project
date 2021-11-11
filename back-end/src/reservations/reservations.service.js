const knex = require("../db/connection");

function list() {
  return knex("reservations").select("*");
}

//List all movies
function listTables() {
  return knex("tables").select("*");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((results) => results[0]);
}

module.exports = {
  list,
  listTables,
  create,
};
