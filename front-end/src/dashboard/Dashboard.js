//The main functions of the Dashboard component are to display all of the reservations
//and allow the user to seat, edit, or cancel reservations and to display all of the
//tables and allow the user to finish the tables

import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  listReservations,
  updateReservationStatus,
  updateTableStatus,
} from "../utils/api";
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
  //The main state variables are reservations and tables which are arrays to be displayed
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  //Declare an instance of the useHistory hook
  const history = useHistory();

  //Create the functionality for the prev, today, and next buttons to toggle dates
  //Function to add a day to a date
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  //Extract the year, month, and day from the date passed in and use it to
  //create a date that can be incremented and decremented
  let month = Number(date.substring(5, 7)) - 1;
  let day = Number(date.substring(8, 10));
  let year = Number(date.substring(0, 4));

  let currDate = new Date(year, month, day);

  //For the prevDate and nextDate, convert the date to a text string
  //Convert prevDate to a text string
  let prevDate = currDate.addDays(-1);
  let prevDateDay = prevDate.getDate();
  if (prevDateDay < 10) prevDateDay = "0" + prevDateDay;
  let prevDateMonth = prevDate.getMonth() + 1;
  if (prevDateMonth < 10) prevDateMonth = "0" + prevDateMonth;
  let prevDateString =
    prevDate.getFullYear() + "-" + prevDateMonth + "-" + prevDateDay;

  //Convert nextDate to a text string
  let nextDate = currDate.addDays(1);
  let nextDateDay = nextDate.getDate();
  if (nextDateDay < 10) nextDateDay = "0" + nextDateDay;
  let nextDateMonth = nextDate.getMonth() + 1;
  if (nextDateMonth < 10) nextDateMonth = "0" + nextDateMonth;
  let nextDateString =
    nextDate.getFullYear() + "-" + nextDateMonth + "-" + nextDateDay;
  console.log("nextDateString", nextDateString);

  //Use useEffect to load the reservations and the tables

  //Load reservations
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  //Load tables
  useEffect(loadTables, [date]);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  //Create the handleFinish function to finish a table
  //This function changes the status of a reservation to 'finished' and the status of table to 'free'
  async function handleFinish(reservationId, tableId) {
    //Create a reservation object with a reservation_id and set the status to 'finished'
    console.log("reservationId", reservationId);
    let reservation = {
      data: {},
    };

    reservation.data.reservation_id = reservationId;
    reservation.data.status = "finished";

    //Create a table object with a table_id and set the reservation_id to null (which makes it 'free')
    let table = {
      data: {},
    };

    table.data.table_id = tableId;
    table.data.reservation_id = null;

    //Make an api call to update the reservation's status
    async function changeReservation(reservation) {
      const response = await updateReservationStatus(reservation);
    }

    if (reservationId !== null) changeReservation(reservation);

    //Make an api call to update the table's status
    async function changeTable(table) {
      const response = await updateTableStatus(table);
      console.log(response);
    }
    await changeTable(table);

    //Reload reservations and tables
    loadTables();
    loadDashboard();
  }

  //Create a handleCancel function to cancel a reservation
  //This function sets a reservation's status to cancelled
  async function handleCancel(reservationId) {
    //Create a reservation object with a reservation_id and set the status to cancelled
    let reservation = {
      data: {},
    };

    reservation.data.reservation_id = reservationId;
    reservation.data.status = "cancelled";

    //Make an api call to update the status of the reservation
    async function changeReservation(reservation) {
      const response = await updateReservationStatus(reservation);
    }
    await changeReservation(reservation);
    loadDashboard();
  }

  //Create table rows of reservations using the 'reservations' state array
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

  //Create table rows of tables using the 'tables' state array
  const tableLinks = tables.map((table) => {
    let visible = table.reservation_id ? true : null;

    return (
      <tr>
        <td>{table.table_id}</td>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td>{table.reservation_id}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id === null ? "free" : "occupied"}
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

  //Return the html code for the reservations and the tables
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
        <tr>
          <td>
            <Link to={`/dashboard?date=${prevDateString}`}>
              <button type="button" class="btn btn-primary">
                Previous
              </button>
            </Link>{" "}
          </td>
          <td>
            <Link to={`/dashboard`}>
              <button type="button" class="btn btn-primary">
                Today
              </button>
            </Link>{" "}
          </td>
          <td>
            <Link to={`/dashboard?date=${nextDateString}`}>
              <button type="button" class="btn btn-primary">
                Next
              </button>
            </Link>{" "}
          </td>
        </tr>
      </table>
      <br />
      <h1>Tables for Seating</h1>
      <table>
        <tr>
          <th>Table ID</th>
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
