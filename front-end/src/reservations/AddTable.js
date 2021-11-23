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
  //Create name and description state variables and add event listeners
  const [tableName, setTableName] = useState("");
  const handleTableNameChange = (event) => setTableName(event.target.value);

  const [capacity, setCapacity] = useState("");
  const handleCapacityChange = (event) => setCapacity(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    let table = {
      data: {},
    };

    table.data.table_name = tableName;
    table.data.capacity = capacity;

    console.log("submit table", table);

    async function newTable(table) {
      const response = await createTable(table);
    }
    newTable(table);

    document.location.href = "/tables/new";
  };

  //Create the handleCancel function to cancel and return to the homepage1
  const handleCancel = (event) => {
    console.log("we here");
    event.preventDefault();
    document.location.href = "/dashboard";
  };

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
