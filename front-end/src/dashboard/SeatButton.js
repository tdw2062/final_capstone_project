import React, { useEffect, useState } from "react";

import { listReservations } from "../utils/api";

function SearchResults({ visibility }) {
  console.log("value of visibility", visibility);
  if (visibility !== null) {
    return (
      <td>
        <button type="button" class="btn btn-outline-primary">
          Seat
        </button>
      </td>
    );
  } else {
    return null;
  }
}

export default SearchResults;
