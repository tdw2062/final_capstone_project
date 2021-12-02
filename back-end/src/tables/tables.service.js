const knex = require("../db/connection");

//Create a table
function createTable(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((results) => results[0]);
}

//Get one table by table_id
function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

//List all reservations
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

//Update a table by tableId
function update(updatedTable, tableId) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .update(updatedTable, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

//Modify a given reservation by reservationId
function updateReservation(updatedReservation, reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .update(updatedReservation, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

//Get one reservation by reservation_id
function readReservation(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

module.exports = {
  createTable,
  list,
  read,
  readReservation,
  update,
  updateReservation,
};
