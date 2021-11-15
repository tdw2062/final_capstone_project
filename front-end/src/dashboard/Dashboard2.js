import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard2({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const reservationLinks = reservations.map((reservation) => (
    <tr>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
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
        </tr>

        {reservationLinks}
      </table>
    </main>
  );
}

export default Dashboard2;
