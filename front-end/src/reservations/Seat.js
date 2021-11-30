//The Seat Component is used to assign a reservation to a table

import React, { useEffect, useState } from "react";
import {
  listTables,
  updateReservationWithTableId,
  updateTable,
  readReservation,
  readTable,
} from "../utils/api";
import { useParams } from "react-router-dom";
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

  //The handleTableIdChange function is called whenever the value for the table drop-down is changed
  //This function sets the table_id, capacity, and occupied status of the table
  function handleTableIdChange(event) {
    setTableId(event.target.value);

    async function getTable(table_id) {
      const response = await readTable(table_id);
      setCapacity(response.capacity);
      setOccupied(response.reservation_id);
      console.log("tableCapacity", capacity);
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
      console.log("peopleInside", people);
    }
    getReservation(reservationId);
  }

  console.log("peopleInside2", people);

  //Create table rows from the tables state array and use to populate the drop-down
  const tableLinks = tables.map((table) => (
    <option value={table.table_id}>
      {table.table_name} - capacity {table.capacity}
    </option>
  ));

  //Create the handleSubmit function to seat a party at a table
  //This function changes the status of a reservation to "seated" and it
  //changes the reservation_id on the table to match the party's reservation_id
  //so that the table is "occupied"
  const handleSubmit = (event) => {
    event.preventDefault();
    validate();
    let reservation = {
      data: {},
    };

    reservation.data.reservation_id = reservationId;
    reservation.data.status = "seated";

    async function changeReservation(reservation, tableId) {
      const response = await updateReservationWithTableId(reservation, tableId);
      console.log(response);
    }
    changeReservation(reservation, tableId);

    let table = {
      data: {},
    };

    table.data.table_id = tableId;
    table.data.reservation_id = reservationId;
    console.log("table", table);

    async function changeTable(table) {
      const response = await updateTable(table);
      console.log(response);
    }
    changeTable(table);

    //document.location.href = "/dashboard";
  };

  //The validate function is used by the handleSubmit function to make sure
  //that the table has sufficient capacity and that it is not occupied.
  const validate = () => {
    //Reset visibility
    setVisibility(null);
    setVisibility2(null);

    console.log("logCapacity", capacity);
    console.log("logPeople", people);

    if (capacity < people) {
      setVisibility(true);
    }

    console.log("visibilityStatus", visibility);

    if (occupied !== null) {
      setVisibility2(true);
    }
  };

  //Create the handleCancel function to return the user to the reservations page
  const handleCancel = (event) => {
    document.location.href = `/reservations`;
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
          id="tableSeat"
          name="tableSeat"
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
