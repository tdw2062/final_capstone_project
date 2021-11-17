exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary(); // sets reservation_id as the primary key
    table.string("first_name");
    table.string("last_name");
    table.string("mobile_number");
    table.date("reservation_date");
    table.time("reservation_time");
    table.integer("people");
    table.string("status").notNullable().defaultTo("booked");
    table.timestamps(true, true); // adds created_at and updated_at columns; passing true as the first argument sets the columns to be a timestamp type while passing true as the second argument sets those columns to be non-nullable and to use the current timestamp by default
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};
