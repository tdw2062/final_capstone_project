import React, { useEffect, useState } from "react";
import { listTables, updateReservation, updateTable } from "../utils/api";
import { useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Seat({ date }) {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const [tableId, setTableId] = useState("");
  const handleTableIdChange = (event) => setTableId(event.target.value);

  useEffect(loadTables, [date]);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const tableLinks = tables.map((table) => (
    <option value={table.table_id}>
      {table.table_name} - capacity {table.capacity}
    </option>
  ));

  //Get ReservationId from url
  const { reservationId } = useParams();

  //Create the handleSubmit function to update the deck
  //This function creates a deck based on the user input and then uses updateDeck() api call
  const handleSubmit = (event) => {
    event.preventDefault();
    let reservation = {
      data: {},
    };

    reservation.data.reservation_id = reservationId;
    reservation.data.status = "seated";

    async function changeReservation(reservation) {
      const response = await updateReservation(reservation);
      console.log(response);
    }
    changeReservation(reservation);

    let table = {
      data: {},
    };

    table.data.table_id = tableId;
    table.data.reservation_id = reservationId;
    console.log("table", table);

    async function changeTable(table) {
      const response = await updateTable(table);
      console.log(response);
    }
    changeTable(table);

    //document.location.href = "/";
  };

  //Create the handleCancel function to return the user to the deck page
  const handleCancel = (event) => {
    document.location.href = `/reservations`;
  };

  return (
    <main>
      <h1>Seat the Party</h1>
      <br />
      <div class="form-group">
        <label for="exampleFormControlSelect1">Choose Table</label>
        <select
          class="form-control"
          id="tableSeat"
          name="tableSeat"
          onChange={handleTableIdChange}
          value={tableId}
        >
          <option value="">--Select an Option--</option>
          {tableLinks}
        </select>
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button
          type="cancel"
          className="btn btn-primary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </main>
  );
}

export default Seat;
