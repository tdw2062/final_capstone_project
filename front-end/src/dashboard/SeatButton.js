import React, { useEffect, useState } from "react";

function SeatButton({ visibility }) {
  console.log("value of visibility", visibility);
  if (visibility !== null) {
    return (
      <td>
        <button type="button" class="btn btn-outline-primary">
          Seat
        </button>
      </td>
    );
  } else {
    return null;
  }
}

export default SeatButton;
