import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ResForm from "./ResForm";
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
  const handlePeopleChange = (event) => setPeople(Number(event.target.value));

  //Set visibility for the different types of errors that can occur
  const [visibility, setVisibility] = useState(null);
  const [visibility2, setVisibility2] = useState(null);
  const [visibility3, setVisibility3] = useState(null);

  //Create instance of useHistory hook
  const history = useHistory();

  //Create switched
  let switched = null;

  //Create the handleSubmit function which creates a reservation based on the input and
  //makes an api call to add that reservation to the database
  const handleSubmit = (event) => {
    switched = null;

    //Validate the input
    validate();

    event.preventDefault();
    let reservation = {
      data: {},
    };

    //Set state variables
    reservation.data.first_name = firstName;
    reservation.data.last_name = lastName;
    reservation.data.mobile_number = mobileNumber;
    reservation.data.reservation_date = reservationDate;
    reservation.data.reservation_time = reservationTime;
    reservation.data.people = people;

    //Make api call to create a new reservation
    async function newReservation(reservation) {
      const response = await createReservation(reservation);
    }
    newReservation(reservation);

    //If the api call was successful, go back to the dashboard
    if (!switched) {
      history.push(`/dashboard?date=${reservationDate}`);
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

    //Compare the current date with the date of the reservation entered
    let resDate = new Date(year, month, day);
    resDate.setHours(hours);
    resDate.setMinutes(minutes);

    let today = new Date();

    //If the current date is greater than the reservation date, throw an error
    if (resDate.valueOf() < today.valueOf()) {
      setVisibility(true);
      switched = true;
    }

    //If the reservation is made on a Tuesday, throw an error
    if (resDate.getDay() === 2) {
      setVisibility2(true);
      switched = true;
    }

    //If the reservation is earlier than 10:30am or later than 9:30pm, throw an error
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
    event.preventDefault();
    history.push("/dashboard");
  };

  //Return the form with inputs to create a new reservation
  return (
    <main>
      <h1>Add a New Reservation</h1>
      <ResForm
        firstName={firstName}
        handleFirstNameChange={handleFirstNameChange}
        lastName={lastName}
        handleLastNameChange={handleLastNameChange}
        mobileNumber={mobileNumber}
        handleMobileNumberChange={handleMobileNumberChange}
        reservationDate={reservationDate}
        handleReservationDateChange={handleReservationDateChange}
        reservationTime={reservationTime}
        handleReservationTimeChange={handleReservationTimeChange}
        people={people}
        handlePeopleChange={handlePeopleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
      <PastDateError visibility={visibility} />
      <TuesdayError visibility2={visibility2} />
      <TimeError visibility3={visibility3} />
    </main>
  );
}

export default NewReservation;
