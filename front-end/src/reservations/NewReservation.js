import React, { useEffect, useState } from "react";
import { createReservation } from "../utils/api";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";
import PastDateError from "./PastDateError";
import TuesdayError from "./TuesdayError";
import TimeError from "./TimeError";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function NewReservation({ date }) {
  //Create state variables and add event listeners
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

  //Set visibility for the different types of errors that can occur
  const [visibility, setVisibility] = useState(null);
  const [visibility2, setVisibility2] = useState(null);
  const [visibility3, setVisibility3] = useState(null);

  //Create switched
  let switched = null;

  //Create the handleSubmit function which creates a reservation based on the input and
  //makes an api call to add that reservation to the database
  const handleSubmit = (event) => {
    switched = null;

    validate();

    event.preventDefault();
    let reservation = {
      data: {},
    };

    reservation.data.first_name = firstName;
    reservation.data.last_name = lastName;
    reservation.data.mobile_number = mobileNumber;
    reservation.data.reservation_date = reservationDate;
    reservation.data.reservation_time = reservationTime;
    reservation.data.people = people;
    console.log("submit reservation", reservation);

    async function newReservation(reservation) {
      const response = await createReservation(reservation);
    }
    newReservation(reservation);

    console.log("switched", switched);
    if (!switched) {
      document.location.href = `/dashboard?date=${reservationDate}`;
    }
  };

  //The validate function ensures that the reservation is not in the past, on a Tuesday,
  //or before 10:00AM or after 9:30PM
  const validate = () => {
    //Reset visibility
    setVisibility(null);
    setVisibility2(null);
    setVisibility3(null);

    //Create date for reservation date
    let month = Number(reservationDate.substring(5, 7)) - 1;
    let day = Number(reservationDate.substring(8, 10));
    let year = Number(reservationDate.substring(0, 4));
    let hours = Number(reservationTime.substring(0, 2));
    let minutes = Number(reservationTime.substring(3));

    let resDate = new Date(year, month, day);
    resDate.setHours(hours);
    resDate.setMinutes(minutes);

    let today = new Date();
    console.log("today", today);
    console.log("resDate", resDate);

    if (resDate.valueOf() < today.valueOf()) {
      setVisibility(true);
      switched = true;
    }

    if (resDate.getDay() === 2) {
      setVisibility2(true);
      switched = true;
    }

    if (
      resDate.getHours() < 10 ||
      (resDate.getHours() === 10 && resDate.getMinutes() < 30)
    ) {
      setVisibility3(true);
      switched = true;
    }

    if (
      resDate.getHours() > 21 ||
      (resDate.getHours() === 21 && resDate.getMinutes() > 30)
    ) {
      setVisibility3(true);
      switched = true;
    }
  };

  //Create the handleCancel function to cancel and return to the homepage1
  const handleCancel = (event) => {
    console.log("we here");
    event.preventDefault();
    document.location.href = "/dashboard";
  };

  //Return the form with inputs to create a new reservation
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
      <PastDateError visibility={visibility} />
      <TuesdayError visibility2={visibility2} />
      <TimeError visibility3={visibility3} />
    </main>
  );
}

export default NewReservation;
