//The CapacityError is used to notify that the capacity is less than the party
//The only prop is visibility

import React from "react";

function ErrorCaught({ visibility3, msg }) {
  if (visibility3 !== null) {
    return (
      <div class="alert alert-danger" role="alert">
        {msg}
      </div>
    );
  } else {
    return null;
  }
}

export default ErrorCaught;
