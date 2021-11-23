import React from "react";

import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Reservations from "../reservations/Reservations";
import EditReservation from "../reservations/EditReservation";
import NewReservation from "../reservations/NewReservation";
import AddTable from "../reservations/AddTable";
import Search from "../reservations/Search";
import Seat from "../reservations/Seat";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = new URLSearchParams(useLocation().search);
  let date = query.get("date");
  if (!date) {
    date = today();
    // TODO: set query param to default date
  }

  console.log("currentDate", date);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/seat">
        <Seat date={date} />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/edit">
        <EditReservation date={date} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation date={date} />
      </Route>
      <Route exact={true} path="/reservations">
        <Reservations date={date} />
      </Route>
      <Route exact={true} path="/search">
        <Search date={date} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} />
      </Route>

      <Route path="/tables/new">
        <AddTable date={date} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
