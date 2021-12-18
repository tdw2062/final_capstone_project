import React, { useState } from "react";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorCaught from "./ErrorCaught";
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

  //State vars for ErrorCaught
  const [visibility3, setVisibility3] = useState(null);
  const [errMessage, setErrMessage] = useState("");

  //Create instance of useHistory hook
  const history = useHistory();

  //The handleSubmit function creates a new table and posts it to the db
  const handleSubmit = (event) => {
    console.log("helloThereGuy");
    event.preventDefault();

    setVisibility3(null);

    //Create a table object and set its name and capacity according to the
    //input fields
    let table = {
      data: {},
    };

    table.data.table_name = tableName;
    table.data.capacity = Number(capacity);

    //Make an api call to post the new table to the db
    async function newTable(table) {
      try {
        const response = await createTable(table);
        if (response) history.push("/dashboard");
      } catch (err) {
        console.log("Error making createTable API call: ", err);
        setErrMessage(err);
        setVisibility3(true);
      }
    }

    newTable(table);
  };

  //Create the handleCancel function to cancel and return to the homepage
  const handleCancel = (event) => {
    event.preventDefault();
    window.history.back();
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
      <ErrorCaught visibility3={visibility3} msg={errMessage} />
    </main>
  );
}

export default AddTable;
