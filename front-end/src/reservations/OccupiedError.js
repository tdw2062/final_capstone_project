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
