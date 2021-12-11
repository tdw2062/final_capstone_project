//The Finish Button is used to finish a party's time at a table
//The button will appear next to a table on the Dashboard
//The four props are visibility, handleFinish, the reservationId, and the tableId

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function FinishButton({ visibility, handleFinish, reservationId, tableId }) {
  const history = useHistory();

  console.log("value of visibility", visibility);
  const sendAlert = (event) => {
    event.preventDefault();

    //Give an alert asking if they truly want to finish the table
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      handleFinish(reservationId, tableId);
    } else {
      history.push("/dashboard");
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
