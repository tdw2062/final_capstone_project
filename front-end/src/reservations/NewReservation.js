import React, { useEffect, useState } from "react";
import { createReservation } from "../utils/api";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function NewReservation({ date }) {
  //Create name and description state variables and add event listeners
  const [firstName, setFirstName] = useState("");
  const handleFirstNameChange = (event) => setFirstName(event.target.value);

  const [lastName, setLastName] = useState("");
  const handleLastNameChange = (event) => setLastName(event.target.value);

  const [mobileNumber, setMobileNumber] = useState("");
  const handleMobileNumberChange = (event) =>
    setMobileNumber(event.target.value);

  const [reservationDate, setReservationDate] = useState("");
  const handleReservationDateChange = (event) =>
    setReservationDate(event.target.value);

  const [reservationTime, setReservationTime] = useState("");
  const handleReservationTimeChange = (event) =>
    setReservationTime(event.target.value);

  const [people, setPeople] = useState("");
  const handlePeopleChange = (event) => setPeople(event.target.value);

  //Create the handleSubmit function which creates a reservation based on the input and
  //makes an api call to add that reservation to the database
  const handleSubmit = (event) => {
    event.preventDefault();
    let reservation = {};

    reservation.first_name = firstName;
    reservation.last_name = lastName;
    reservation.mobile_number = mobileNumber;
    reservation.reservation_date = reservationDate;
    reservation.reservation_time = reservationTime;
    reservation.people = people;
    console.log(reservation);

    async function newReservation(reservation) {
      const response = await createReservation(reservation);
    }
    newReservation(reservation);
  };

  //Create the handleCancel function to cancel and return to the homepage1
  const handleCancel = (event) => {
    console.log("we here");
    event.preventDefault();
  };

  return (
    <main>
      <h1>Add a New Reservation</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            id="first_name"
            aria-describedby="emailHelp"
            onChange={handleFirstNameChange}
            value={firstName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            id="last_name"
            onChange={handleLastNameChange}
            value={lastName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            type="text"
            name="mobile_number"
            className="form-control"
            id="mobile_number"
            onChange={handleMobileNumberChange}
            value={mobileNumber}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Date of Reservation</label>
          <input
            type="date"
            name="reservation_date"
            className="form-control"
            id="reservation_date"
            onChange={handleReservationDateChange}
            value={reservationDate}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Time of Reservation</label>
          <input
            type="time"
            name="reservation_time"
            className="form-control"
            id="reservation_time"
            onChange={handleReservationTimeChange}
            value={reservationTime}
          />
        </div>
        <div className="form-group">
          <label htmlFor="people">People</label>
          <input
            type="number"
            name="people"
            className="form-control"
            id="people"
            onChange={handlePeopleChange}
            value={people}
          />
        </div>
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
    </main>
  );
}

export default NewReservation;
