//The CapacityError is used to notify that the capacity is less than the party
//The only prop is visibility

import React, { useEffect, useState } from "react";

function CapacityError({ visibility }) {
  if (visibility !== null) {
    return (
      <div class="alert alert-danger" role="alert">
        The table must have sufficient capacity to seat the party.
      </div>
    );
  } else {
    return null;
  }
}

export default CapacityError;
