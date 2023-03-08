import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Nav from "./routes-nav/Nav";
import Routes from "./routes-nav/Routes";
import LoadingSpinner from "./helpers/LoadingSpinner";
import JoblyApi from "./api/api";
import UserContext from "./auth/UserContext";
import jwt from "jsonwebtoken";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "jobly-token";

/** Jobly application.
 *
 * - infoLoaded: has user data been pulled from API?
 *   (this manages spinner for "loading...")
 *
 * - currentUser: user obj from API. This becomes the canonical way to tell
 *   if someone is logged in. This is passed around via context throughout app.
 *
 * - token: for logged in users, this is their authentication JWT.
 *   Is required to be set for most API calls. This is initially read from
 *   localStorage and synced to there via the useLocalStorage hook.
 *
 * App -> Routes
 */

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [applicationIds, setApplicationIds] = useState(new Set([]));
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  useEffect(
    function loadUserInfo() {

      async function getCurrentUser() {
        if (token) {
          try {
            let { username } = jwt.decode(token);
            // put the token on the Api class so it can use it to call the API.
            JoblyApi.token = token;
            let currentUser = await JoblyApi.getCurrentUser(username);
            setCurrentUser(currentUser);
            setApplicationIds(new Set(currentUser.applications));
          } catch (err) {
            console.error("App loadUserInfo: problem loading", err);
            setCurrentUser(null);
          }
        }
        setInfoLoaded(true);
      }

      setInfoLoaded(false);
      getCurrentUser();
    },
    [token]
  );

  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  async function signup(signupData) {
    try {
      let token = await JoblyApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  async function login(loginData) {
    try {
      let token = await JoblyApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  function hasAppliedToJob(id) {
    return applicationIds.has(id);
  }

  function applyToJob(id) {
    if (hasAppliedToJob(id)) return;
    JoblyApi.applyToJob(currentUser.username, id);
    setApplicationIds(new Set([...applicationIds, id]));
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{ currentUser, setCurrentUser, hasAppliedToJob, applyToJob }}
      >
        <div className="App">
          <Nav logout={logout} />
          <Routes login={login} signup={signup} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
