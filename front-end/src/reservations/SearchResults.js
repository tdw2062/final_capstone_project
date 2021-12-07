//The SearchResults component is used to show the results from the search for reservations by phone number
//It is used on the Search component

import React, { useEffect, useState } from "react";

function SearchResults({ visibility, phoneNumber, reservations }) {
  //Create table rows of the reservations to display in the search results
  //Use the reservations state array to create the arrows.
  const reservationLinks = reservations.map((reservation) => (
    <tr>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
    </tr>
  ));

  if (visibility !== null) {
    if (reservations.length === 0) {
      return (
        <div>
          <h1>No reservations found</h1>
        </div>
      );
    } else {
      //Return the results as a table
      return (
        <div>
          <h1>Reservations Found for {phoneNumber}</h1>
          <table>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>People</th>
            {reservationLinks}
          </table>
        </div>
      );
    }
  } else {
    return null;
  }
}

export default SearchResults;
