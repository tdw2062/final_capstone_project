const knex = require("../db/connection");

function createTable(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((results) => results[0]);
}

module.exports = {
  createTable,
};
