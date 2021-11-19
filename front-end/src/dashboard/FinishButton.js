import React, { useEffect, useState } from "react";

function FinishButton({ visibility, handleFinish, reservationId }) {
  console.log("value of visibility", visibility);
  if (visibility !== null) {
    return (
      <td>
        <button
          type="button"
          class="btn btn-outline-primary"
          onClick={() => handleFinish(reservationId)}
        >
          Finish
        </button>
      </td>
    );
  } else {
    return null;
  }
}

export default FinishButton;
