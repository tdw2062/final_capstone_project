import React, { useEffect, useState } from "react";
import {
  listTables,
  updateReservation,
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
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const [tableId, setTableId] = useState("");
  const handleTableIdChange = (event) => setTableId(event.target.value);

  const [visibility, setVisibility] = useState(null);
  const [visibility2, setVisibility2] = useState(null);

  useEffect(loadTables, [date]);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const tableLinks = tables.map((table) => (
    <option value={table.table_id}>
      {table.table_name} - capacity {table.capacity}
    </option>
  ));

  //Get ReservationId from url
  const { reservationId } = useParams();

  //Create the handleSubmit function to update the deck
  //This function creates a deck based on the user input and then uses updateDeck() api call
  const handleSubmit = (event) => {
    event.preventDefault();
    validate();
    let reservation = {
      data: {},
    };

    reservation.data.reservation_id = reservationId;
    reservation.data.status = "seated";

    async function changeReservation(reservation) {
      const response = await updateReservation(reservation);
      console.log(response);
    }
    changeReservation(reservation);

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

  const validate = () => {
    //Reset visibility
    setVisibility(null);
    setVisibility2(null);

    //Make call to get the reservation and check the number of people in the reservation
    async function getReservation(reservationId) {
      const response = await readReservation(reservationId);
      let people = response.people;
      console.log("people", people);
    }
    getReservation(reservationId);

    //Make call to get the table and check the capacity of the table
    async function getTable(tableId) {
      const response = await readTable(tableId);
      let capacity = response.capacity;
      console.log("tableCapacity", capacity);
    }
    getTable(tableId);

    /*
    if (reservationDate < today()) {
      setVisibility(true);
    }

    if (resDate.getDay() === 2) {
      setVisibility2(true);
    }*/
  };

  //Create the handleCancel function to return the user to the deck page
  const handleCancel = (event) => {
    document.location.href = `/reservations`;
  };

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
