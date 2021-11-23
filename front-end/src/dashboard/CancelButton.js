import React, { useEffect, useState } from "react";

function CancelButton({ visibility, handleCancel, reservationId }) {
  const sendAlert = (event) => {
    event.preventDefault();

    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      handleCancel(reservationId);
    } else {
      document.location.href = "/dashboard";
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
