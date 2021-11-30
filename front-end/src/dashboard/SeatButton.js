//The Seat Button is used to seat a reservation
//The button will appear next to a reservation on the Dashboard
//The two props are visibility and reservationId

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SeatButton({ visibility, reservationId }) {
  console.log("value of visibility", visibility);
  if (visibility !== null) {
    return (
      <td>
        <Link to={`/reservations/${reservationId}/seat`}>
          <button type="button" class="btn btn-outline-primary">
            Seat
          </button>
        </Link>{" "}
      </td>
    );
  } else {
    return null;
  }
}

export default SeatButton;
