//The Seat Component is used to assign a reservation to a table

import React, { useEffect, useState } from "react";
import {
  listTables,
  updateTable,
  readReservation,
  readTable,
} from "../utils/api";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import CapacityError from "./CapacityError";
import OccupiedError from "./OccupiedError";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Seat({ date }) {
  //Create state variables
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [tableId, setTableId] = useState("");
  const [visibility, setVisibility] = useState(null);
  const [visibility2, setVisibility2] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [people, setPeople] = useState(null);
  const [occupied, setOccupied] = useState(null);

  //history hook
  const history = useHistory();

  //The handleTableIdChange function is called whenever the value for the table drop-down is changed
  //This function sets the table_id, capacity, and occupied status of the table
  function handleTableIdChange(event) {
    setTableId(event.target.value);

    async function getTable(table_id) {
      const response = await readTable(table_id);
      setCapacity(response.capacity);
      setOccupied(response.reservation_id);
    }

    getTable(event.target.value);
  }

  //Get ReservationId from url
  const { reservationId } = useParams();

  //Use useEffect to load the tables
  useEffect(loadTables, [date]);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    loadPeople();
    return () => abortController.abort();
  }

  function loadPeople() {
    //Make call to get the reservation and check the number of people in the reservation
    async function getReservation(reservationId) {
      const response = await readReservation(reservationId);
      setPeople(response.people);
    }
    getReservation(reservationId);
  }

  //Create table rows from the tables state array and use to populate the drop-down
  const tableLinks = tables.map((table) => (
    <option value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  //Create the handleSubmit function to seat a party at a table
  //This function changes the status of a reservation to "seated" and it
  //changes the reservation_id on the table to match the party's reservation_id
  //so that the table is "occupied"
  async function handleSubmit(event) {
    event.preventDefault();
    validate();

    //Create a table object with a table_id and reservation_id
    let table = {
      data: {},
    };

    table.data.table_id = tableId;
    table.data.reservation_id = reservationId;

    //Update the table with the reservation_id
    async function changeTable(table) {
      const response = await updateTable(table);
    }
    await changeTable(table);

    history.push("/dashboard");
  }

  //The validate function is used by the handleSubmit function to make sure
  //that the table has sufficient capacity and that it is not occupied.
  const validate = () => {
    //Reset visibility
    setVisibility(null);
    setVisibility2(null);

    //Display an error message if table capacity is less than the size of the party
    if (capacity < people) {
      setVisibility(true);
    }

    if (occupied !== null) {
      setVisibility2(true);
    }
  };

  //Create the handleCancel function to return the user to the reservations page
  const handleCancel = (event) => {
    window.history.back();
  };

  //Return the drop-down and the submit button to allow a user to seat a party at a table
  return (
    <main>
      <h1>Seat the Party</h1>
      <br />
      <div class="form-group">
        <label for="exampleFormControlSelect1">Choose Table</label>
        <select
          class="form-control"
          id="table_id"
          name="table_id"
          onChange={handleTableIdChange}
          value={tableId}
        >
          <option value="">--Select an Option--</option>
          {tableLinks}
        </select>
      </div>
      <form onSubmit={handleSubmit}>
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
      <CapacityError visibility={visibility} />
      <OccupiedError visibility2={visibility2} />
    </main>
  );
}

export default Seat;
