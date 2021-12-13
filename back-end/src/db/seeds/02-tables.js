//Seed the tables table
//Every time the seed file is run, delete the rows and  reset the autonumeric counter

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex.raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE");

  return knex("tables").insert([
    {
      table_name: "Bar #1",
      capacity: 1,
    },
    {
      table_name: "Bar #2",
      capacity: 1,
    },
    {
      table_name: "#1",
      capacity: 6,
    },
    {
      table_name: "#2",
      capacity: 6,
    },
  ]);
};
