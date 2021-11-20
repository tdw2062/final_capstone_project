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
