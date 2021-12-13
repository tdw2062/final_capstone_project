/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);
    console.log("response body", response.body);

    if (response.status === 204) {
      console.log("status returned is 204");
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    console.log("payload", payload);
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

//Returns a list of reservations filtered by a given parameter
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );

  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

//Returns a list of tables
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

//Creates a reservation
export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(reservation),
    signal,
  };

  return await fetchJson(url, options, {});
}

//Creates a table
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables/new`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(table),
    signal,
  };
  console.log("url to use", url, "options", options);
  return await fetchJson(url, options, {});
}

//Gets one specific reservation by reservation_id
export async function readReservation(reservationId, signal) {
  console.log("hello");
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  return await fetchJson(url, { signal }, {});
}

//Gets one specific table by table_id
export async function readTable(tableId, signal) {
  console.log("helloTable");
  const url = `${API_BASE_URL}/tables/${tableId}`;
  return await fetchJson(url, { signal }, {});
}

//Updates a reservation
export async function updateReservation(updatedReservation, signal) {
  const url = `${API_BASE_URL}/reservations/${updatedReservation.data.reservation_id}/edit`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(updatedReservation),
    signal,
  };
  return await fetchJson(url, options, updatedReservation);
}

//Updates the status of a reservation
export async function updateReservationStatus(updatedReservation, signal) {
  const url = `${API_BASE_URL}/reservations/${updatedReservation.data.reservation_id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(updatedReservation),
    signal,
  };
  return await fetchJson(url, options, updatedReservation);
}

/*
export async function updateReservationWithTableId(
  updatedReservation,
  tableId,
  signal
) {
  const url = `${API_BASE_URL}/reservations/${updatedReservation.data.reservation_id}/seat/${tableId}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(updatedReservation),
    signal,
  };
  return await fetchJson(url, options, updatedReservation);
}*/

//Updates a table
export async function updateTable(updatedTable, signal) {
  const url = `${API_BASE_URL}/tables/${updatedTable.data.table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(updatedTable),
    signal,
  };
  return await fetchJson(url, options, updatedTable);
}

//Updates the status of a table
export async function updateTableStatus(updatedTable, signal) {
  const url = `${API_BASE_URL}/tables/${updatedTable.data.table_id}/seat`;
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify(updatedTable),
    signal,
  };
  return await fetchJson(url, options, updatedTable);
}
