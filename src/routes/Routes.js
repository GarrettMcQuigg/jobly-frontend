import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import CompanyList from "../companies/CompanyList";
import JobList from "../jobs/JobList";
import CompanyDetail from "../companies/CompanyDetail";
import Login from "../auth/Login";
import Profile from "../profiles/Profile";
import Register from "../auth/Register";
import PrivateRoute from "./PrivateRoute";

function Routes({ login, signup }) {
  console.debug(
    "Routes",
    `login=${typeof login}`,
    `register=${typeof register}`
  );

  return (
    <div className="pt-5">
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>

        <Route exact path="/login">
          <Login login={login} />
        </Route>

        <Route exact path="/signup">
          <Register signup={signup} />
        </Route>

        <PrivateRoute exact path="/companies">
          <CompanyList />
        </PrivateRoute>

        <PrivateRoute exact path="/jobs">
          <JobList />
        </PrivateRoute>

        <PrivateRoute exact path="/companies/:handle">
          <CompanyDetail />
        </PrivateRoute>

        <PrivateRoute path="/profile">
          <Profile />
        </PrivateRoute>

        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default Routes;
