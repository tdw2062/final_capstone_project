//The OccupiedError is used when the the user tries to seat a party at an occupied table
//The Error appears on the Seat Component
//The sole prop is visibility2

import React, { useEffect, useState } from "react";

function OccupiedError({ visibility2 }) {
  if (visibility2 !== null) {
    return (
      <div class="alert alert-danger" role="alert">
        The table selected is occupied.
      </div>
    );
  } else {
    return null;
  }
}

export default OccupiedError;
