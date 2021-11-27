import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations, updateReservation, updateTable } from "../utils/api";
import { listTables } from "../utils/api";
import SeatButton from "./SeatButton";
import FinishButton from "./FinishButton";
import CancelButton from "./CancelButton";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
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
  function handleFinish(reservationId, tableId) {
    console.log("reservationId", reservationId);
    let reservation = {
      data: {},
    };

    reservation.data.reservation_id = reservationId;
    reservation.data.status = "finished";
    console.log("reservation", reservation);

    let table = {
      data: {},
    };

    table.data.table_id = tableId;
    table.data.reservation_id = null;
    console.log("table", table);

    async function changeReservation(reservation) {
      console.log("updatedReservation");
      const response = await updateReservation(reservation);
      console.log("response", response);
    }

    console.log("reservationId", reservationId);
    if (reservationId !== null) changeReservation(reservation);

    async function changeTable(table) {
      const response = await updateTable(table);
      console.log(response);
    }
    changeTable(table);

    document.location.href = "/dashboard";
  }

  function handleCancel(reservationId) {
    console.log("reservationId", reservationId);
    let reservation = {
      data: {},
    };

    reservation.data.reservation_id = reservationId;
    reservation.data.status = "cancelled";
    console.log("reservation", reservation);

    async function changeReservation(reservation) {
      const response = await updateReservation(reservation);
      console.log("response", response);
    }
    changeReservation(reservation);

    document.location.href = "/dashboard";
  }

  const reservationLinks = reservations.map((reservation) => {
    let visible = reservation.status === "booked" ? true : null;
    let visible2 = reservation.status !== "cancelled" ? true : null;

    return (
      <tr>
        <td>{reservation.reservation_id}</td>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        <td>
          <Link to={`/reservations/${reservation.reservation_id}/edit`}>
            <button type="button" class="btn btn-outline-primary">
              Edit
            </button>
          </Link>{" "}
        </td>
        <td>
          <CancelButton
            visibility={visible2}
            handleCancel={handleCancel}
            reservationId={reservation.reservation_id}
          />
        </td>
        <SeatButton
          visibility={visible}
          reservationId={reservation.reservation_id}
        />
      </tr>
    );
  });

  const tableLinks = tables.map((table) => {
    let visible = table.reservation_id ? true : null;

    return (
      <tr>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td>{table.reservation_id}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id === null ? "Free" : "Occupied"}
        </td>
        <FinishButton
          visibility={visible}
          handleFinish={handleFinish}
          reservationId={table.reservation_id}
          tableId={table.table_id}
        />
      </tr>
    );
  });

  return (
    <main>
      <h1>Reservations</h1>
      <table>
        <tr>
          <th>Reservation ID</th>
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

export default Dashboard;
