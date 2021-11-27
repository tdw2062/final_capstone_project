import React, { useEffect, useState } from "react";

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
