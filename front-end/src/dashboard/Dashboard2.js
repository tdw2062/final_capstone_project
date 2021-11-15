import React, { useEffect, useState } from "react";
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
    </tr>
  ));

  return (
    <main>
      <h1>Reservations</h1>
      <table>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
        </tr>

        {reservationLinks}
      </table>
    </main>
  );
}

export default Dashboard2;
