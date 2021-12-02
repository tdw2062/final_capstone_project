const knex = require("../db/connection");

//List all reservations filtered by params (usually 'date')
function list(params) {
  //If they are searching for a phone number, then use the function to find a partial match
  if (params["mobile_number"]) {
    let mobile_number = params["mobile_number"];
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  } else {
    //If they are searching for anything else, just return the filtered results
    return knex("reservations")
      .select("*")
      .where(params)
      .orderBy("reservation_time");
  }
}

//List all tables
function listTables() {
  return knex("tables").select("*");
}

//Get one reservation by reservation_id
function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

//Get one table by table_id
function readTable(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

//Create (post) a new reservation
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((results) => results[0]);
}

//Create (post) a new table
function createTable(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((results) => results[0]);
}

//Modify a given reservation by reservationId
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
