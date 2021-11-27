import React, { useEffect, useState } from "react";

function FinishButton({ visibility, handleFinish, reservationId, tableId }) {
  console.log("value of visibility", visibility);
  const sendAlert = (event) => {
    event.preventDefault();

    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      handleFinish(reservationId, tableId);
    } else {
      document.location.href = "/dashboard";
    }
  };

  return (
    <td>
      <button
        type="button"
        class="btn btn-outline-primary"
        onClick={sendAlert}
        data-table-id-finish={tableId}
      >
        Finish
      </button>
    </td>
  );
}

export default FinishButton;
