//The StatusError is used when the the user tries to edit a reservation that does not have a status of "booked"
//The Error appears on the Dashboard Component next to the reservation
//The sole prop is visibility

import React from "react";

function StatusError({ visibility }) {
  if (visibility !== null) {
    return (
      <div class="alert alert-danger" role="alert">
        Only reservations with a status of "booked" can be edited.
      </div>
    );
  } else {
    return null;
  }
}

export default StatusError;
