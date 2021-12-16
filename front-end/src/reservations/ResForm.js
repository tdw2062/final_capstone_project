//The Seat Button is used to seat a reservation
//The button will appear next to a reservation on the Dashboard
//The two props are visibility and reservationId

import React, { useEffect, useState } from "react";

function ResForm({
  firstName,
  handleFirstNameChange,
  lastName,
  handleLastNameChange,
  mobileNumber,
  handleMobileNumberChange,
  reservationDate,
  handleReservationDateChange,
  reservationTime,
  handleReservationTimeChange,
  people,
  handlePeopleChange,
  handleSubmit,
  handleCancel,
}) {
  return (
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
      <button type="cancel" className="btn btn-primary" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}

export default ResForm;
