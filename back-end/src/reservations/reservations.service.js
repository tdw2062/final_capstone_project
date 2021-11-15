const knex = require("../db/connection");

//List all reservations
function list() {
  return knex("reservations").select("*");
}

//List all tables
function listTables() {
  return knex("tables").select("*");
}

//Get one reservation by reservation_id
function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
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

function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  list,
  listTables,
  create,
  createTable,
  read,
  update,
};
