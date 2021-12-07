//The Cancel Button is used to cancel a reservation
//The button will appear next to a reservation on the Dashboard
//The three props are visibility, handleCancel, and the reservationId

import React, { useEffect, useState } from "react";

function CancelButton({ visibility, handleCancel, reservationId }) {
  const sendAlert = (event) => {
    event.preventDefault();

    //Give an alert asking if they truly want to cancel the reservation
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      handleCancel(reservationId);
    } else {
    }
  };
  console.log("value of visibility", visibility);
  if (visibility !== null) {
    return (
      <td>
        <button
          type="button"
          class="btn btn-outline-primary"
          onClick={sendAlert}
          data-reservation-id-cancel={reservationId}
        >
          Cancel
        </button>
      </td>
    );
  } else {
    return null;
  }
}

export default CancelButton;
