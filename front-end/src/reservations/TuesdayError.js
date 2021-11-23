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
