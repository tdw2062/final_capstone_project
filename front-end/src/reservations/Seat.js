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
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [tableId, setTableId] = useState("");
  const [visibility, setVisibility] = useState(null);
  const [visibility2, setVisibility2] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [people, setPeople] = useState(null);

  function handleTableIdChange(event) {
    setTableId(event.target.value);

    async function getTable(table_id) {
      const response = await readTable(table_id);
      setCapacity(response.capacity);
      console.log("tableCapacity", capacity);
    }
    getTable(event.target.value);
  }

  //Get ReservationId from url
  const { reservationId } = useParams();

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

  const tableLinks = tables.map((table) => (
    <option value={table.table_id}>
      {table.table_name} - capacity {table.capacity}
    </option>
  ));

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
    /*
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
