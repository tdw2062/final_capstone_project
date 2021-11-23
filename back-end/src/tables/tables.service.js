const knex = require("../db/connection");

function createTable(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((results) => results[0]);
}

//Get one table table_id
function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

//List all reservations
function list() {
  return knex("tables").select("*");
}

function update(updatedTable, tableId) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .update(updatedTable, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  createTable,
  list,
  read,
  update,
};
