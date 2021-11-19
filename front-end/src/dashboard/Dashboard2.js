import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations, updateReservation } from "../utils/api";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard2({ date }) {
  console.log("reprint date", date);

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    const reservation_date = date;
    listReservations({ reservation_date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(loadTables, [date]);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  //Create the handleSubmit function to update the deck
  //This function creates a deck based on the user input and then uses updateDeck() api call
  function handleFinish(reservationId) {
    let reservation = {
      data: {},
    };

    reservation.data.reservation_id = reservationId;
    reservation.data.status = "finished";
    console.log("reservation", reservation);

    async function changeReservation(reservation) {
      const response = await updateReservation(reservation);
      console.log("response", response);
    }
    changeReservation(reservation);
  }

  const reservationLinks = reservations.map((reservation) => (
    <tr>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>{reservation.status}</td>
      <td>
        <Link to={`/reservations/${reservation.reservation_id}/edit`}>
          <button type="button" class="btn btn-outline-primary">
            Edit
          </button>
        </Link>{" "}
      </td>
      <td>
        <button type="button" class="btn btn-outline-primary">
          Cancel
        </button>
      </td>
      <td>
        <button type="button" class="btn btn-outline-primary">
          Seat
        </button>
      </td>
    </tr>
  ));

  const tableLinks = tables.map((table) => (
    <tr>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td>{table.reservation_id}</td>
      <td>{table.reservation_id === null ? "Free" : "Occupied"}</td>
      <td>
        <button
          type="button"
          class="btn btn-outline-primary"
          onClick={() => handleFinish(table.reservation_id)}
        >
          Finish
        </button>
      </td>
    </tr>
  ));

  return (
    <main>
      <h1>Reservations</h1>
      <table>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Mobile Number</th>
          <th>Reservation Date</th>
          <th>Reservation Time</th>
          <th>People</th>
          <th>Status</th>
        </tr>

        {reservationLinks}
      </table>
      <br />
      <h1>Tables for Seating</h1>
      <table>
        <tr>
          <th>Table Name</th>
          <th>Capacity</th>
          <th>Reservation ID</th>
          <th>Status</th>
        </tr>
        {tableLinks}
      </table>
    </main>
  );
}

export default Dashboard2;
