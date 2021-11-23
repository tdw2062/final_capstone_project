import React, { useEffect, useState } from "react";

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
