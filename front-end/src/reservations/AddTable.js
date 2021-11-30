import React, { useEffect, useState } from "react";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function AddTable({ date }) {
  //Create tableName and capacity state variables and add event listeners
  const [tableName, setTableName] = useState("");
  const handleTableNameChange = (event) => setTableName(event.target.value);

  const [capacity, setCapacity] = useState("");
  const handleCapacityChange = (event) => setCapacity(event.target.value);

  //The handleSubmit function creates a new table and posts it to the db
  const handleSubmit = (event) => {
    event.preventDefault();

    //Create a table object and set its name and capacity according to the
    //input fields
    let table = {
      data: {},
    };

    table.data.table_name = tableName;
    table.data.capacity = capacity;

    console.log("submit table", table);

    //Make an api call to post the new table to the db
    async function newTable(table) {
      const response = await createTable(table);
    }
    newTable(table);

    document.location.href = "/tables/new";
  };

  //Create the handleCancel function to cancel and return to the homepage
  const handleCancel = (event) => {
    console.log("we here");
    event.preventDefault();
    document.location.href = "/dashboard";
  };

  //Return the html with inputs for entering the tableName and capacity
  return (
    <main>
      <h1>Add a Table</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            type="text"
            name="table_name"
            className="form-control"
            id="table_name"
            onChange={handleTableNameChange}
            value={tableName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            type="text"
            name="capacity"
            className="form-control"
            id="capacity"
            onChange={handleCapacityChange}
            value={capacity}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button
          type="cancel"
          className="btn btn-primary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </main>
  );
}

export default AddTable;
