//The PastDateError is used when the the user tries to enter a reservation on a date in the past
//The PastDateError on the NewReservation Component
//The sole prop is visibility

import React from "react";

function PastDateError({ visibility }) {
  if (visibility !== null) {
    return (
      <div class="alert alert-danger" role="alert">
        The reservation date must not be a past date!
      </div>
    );
  } else {
    return null;
  }
}

export default PastDateError;
