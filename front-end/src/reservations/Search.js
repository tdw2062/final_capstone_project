import React, { useEffect, useState } from "react";
import SearchResults from "./SearchResults";
import { listReservations } from "../utils/api";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Search({ date }) {
  //Create the phone nubmer state variable and add event listeners
  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneNumberChange = (event) => setPhoneNumber(event.target.value);
  const [visibilityStatus, setVisibilityStatus] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  //UseEffect is used to get the reservations
  useEffect(loadDashboard, [phoneNumber]);

  //Load all of the reservations filtered by phone number
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    const mobile_number = phoneNumber;
    console.log("mobile_number before api", mobile_number);
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    console.log("reservationsFound", reservations);
    return () => abortController.abort();
  }

  //The handleSubmit function merely shows the search results
  const handleSubmit = (event) => {
    event.preventDefault();
    loadDashboard();
    setVisibilityStatus(true);
    console.log("phoneNumber", phoneNumber);
  };

  //Create the handleCancel function to cancel and return to the homepage1
  const handleCancel = (event) => {
    console.log("we here");
    event.preventDefault();
  };

  //Return the form to enter the phone number and show the results
  return (
    <main>
      <h1>Find Reservations</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mobile_number">Enter a Customer Phone Number</label>
          <input
            type="text"
            name="mobile_number"
            className="form-control"
            id="mobile_number"
            onChange={handlePhoneNumberChange}
            value={phoneNumber}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </form>
      <div>
        <SearchResults
          visibility={visibilityStatus}
          phoneNumber={phoneNumber}
          reservations={reservations}
        />
      </div>
    </main>
  );
}

export default Search;
