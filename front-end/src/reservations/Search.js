import React, { useEffect, useState } from "react";
import SearchResults from "./SearchResults";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Search({ date }) {
  //Create name and description state variables and add event listeners
  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneNumberChange = (event) => setPhoneNumber(event.target.value);

  const [visibilityStatus, setVisibilityStatus] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setVisibilityStatus(true);
    console.log("phoneNumber", phoneNumber);
    /*let table = {
      data: {},
    };

    table.data.table_name = tableName;
    table.data.capacity = capacity;

    console.log("submit table", table);

    async function newTable(table) {
      const response = await createTable(table);
    }
    newTable(table);
    */
  };

  //Create the handleCancel function to cancel and return to the homepage1
  const handleCancel = (event) => {
    console.log("we here");
    event.preventDefault();
  };

  return (
    <main>
      <h1>Find Reservations</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phone_number">Enter a Customer Phone Number</label>
          <input
            type="text"
            name="phone_number"
            className="form-control"
            id="phone_number"
            onChange={handlePhoneNumberChange}
            value={phoneNumber}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </form>
      <div>
        <SearchResults
          visibility={visibilityStatus}
          phoneNumber={phoneNumber}
        />
      </div>
    </main>
  );
}

export default Search;
