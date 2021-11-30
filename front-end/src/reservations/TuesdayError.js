//The TuesdayError is used when the the user tries enter a reservation on a Tuesday
//The TuesdayError appears on the NewReservation Component
//The sole prop is visibility2

import React, { useEffect, useState } from "react";

function TuesdayError({ visibility2 }) {
  if (visibility2 !== null) {
    return (
      <div class="alert alert-danger" role="alert">
        Reservations cannot be made on Tuesdays!
      </div>
    );
  } else {
    return null;
  }
}

export default TuesdayError;
