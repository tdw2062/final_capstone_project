//The TimeError is used when the the user tries enter a reservation during an invalid time
//The TimeError appears on the NewReservation Component
//The sole prop is visibility3

import React from "react";

function TimeError({ visibility3 }) {
  if (visibility3 !== null) {
    return (
      <div class="alert alert-danger" role="alert">
        The reservation time cannot be before 10:30AM or after 9:30PM.
      </div>
    );
  } else {
    return null;
  }
}

export default TimeError;
