import React, { useEffect, useState } from "react";
import { listTables } from "../utils/api";
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

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={tablesError} />
      {JSON.stringify(tables)}

      <div class="form-group">
        <label for="exampleFormControlSelect1">Choose Table</label>
        <select class="form-control" id="exampleFormControlSelect1">
          {tableLinks}
        </select>
      </div>
    </main>
  );
}

export default Seat;
