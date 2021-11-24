const knex = require("../db/connection");

//List all reservations
function list(params) {
  return knex("reservations")
    .select("*")
    .where(params)
    .orderBy("reservation_time");
}

//List all tables
function listTables() {
  return knex("tables").select("*");
}

//Get one reservation by reservation_id
function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

//List all tables
function readTable(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((results) => results[0]);
}

function createTable(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((results) => results[0]);
}

function update(updatedReservation, reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .update(updatedReservation, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  list,
  listTables,
  create,
  createTable,
  read,
  readTable,
  update,
};
