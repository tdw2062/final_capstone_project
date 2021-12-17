import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ResForm from "./ResForm";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function EditReservation({ date }) {
  //Create state variables for each field of reservation and add event listeners
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

  //Get ReservationId from url
  const { reservationId } = useParams();

  //Create instance of useHistory hook
  const history = useHistory();

  //Make an API Call to get the reservation based on the reservation_id
  useEffect(() => {
    async function getReservation(reservationId) {
      const response = await readReservation(reservationId);

      let dateString = response.reservation_date.substring(0, 10);

      setFirstName(response.first_name);
      setLastName(response.last_name);
      setMobileNumber(response.mobile_number);
      setReservationDate(dateString);
      setReservationTime(response.reservation_time);
      setPeople(response.people);
    }
    getReservation(reservationId);
  }, [reservationId]);

  //Create the handleSubmit function to update the deck
  //This function creates a reservation based on the user input and then uses changeReservation() api call
  async function handleSubmit(event) {
    event.preventDefault();

    let reservation = {
      data: {},
    };

    reservation.data.reservation_id = reservationId;
    reservation.data.first_name = firstName;
    reservation.data.last_name = lastName;
    reservation.data.mobile_number = mobileNumber;
    reservation.data.reservation_date = reservationDate;
    reservation.data.reservation_time = reservationTime;
    reservation.data.people = people;

    //Make api call to update reservation
    async function changeReservation(reservation) {
      try {
        const response = await updateReservation(reservation);
        console.log(response);
      } catch (err) {
        console.log("Error making updateReservation API call: ", err);
      }
    }
    await changeReservation(reservation);

    //Reset fields
    setFirstName("");
    setLastName("");
    setMobileNumber("");
    setReservationDate("");
    setReservationTime("");
    setPeople("");

    //Go back to dashboard page
    history.push(`/dashboard?date=${reservationDate}`);
  }

  //Create the handleCancel function to return the user to the previous page
  const handleCancel = (event) => {
    history.push(`/dashboard?date=${reservationDate}`);
  };

  //Return the form to enter the reservation details
  return (
    <main>
      <h1>Edit Reservation</h1>
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
    </main>
  );
}

export default EditReservation;
