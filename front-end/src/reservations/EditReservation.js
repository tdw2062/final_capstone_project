import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function EditReservation({ date }) {
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

  return (
    <main>
      <h1>Edit Reservation</h1>
      <form>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            id="first_name"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            id="last_name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            type="text"
            name="mobile_number"
            className="form-control"
            id="mobile_number"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Date of Reservation</label>
          <input
            type="date"
            name="reservation_date"
            className="form-control"
            id="reservation_date"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Time of Reservation</label>
          <input
            type="time"
            name="reservation_time"
            className="form-control"
            id="reservation_time"
          />
        </div>
        <div className="form-group">
          <label htmlFor="people">People</label>
          <input
            type="number"
            name="people"
            className="form-control"
            id="people"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button type="cancel" className="btn btn-primary">
          Cancel
        </button>
      </form>
    </main>
  );
}

export default EditReservation;
