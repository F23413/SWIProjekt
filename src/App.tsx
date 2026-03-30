import './App.css'
import {useEffect, useState} from "react";
import Header from "./pages/header/Header.tsx";
import {Navigate, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import NoMatch from "./pages/noMatch/NoMatch.tsx";
import PostUser from "./pages/employee/PostUser.tsx";
import UpdateUser from "./pages/employee/UpdateUser.tsx";
import Login from "./pages/login/Login.tsx";
import Home from "./pages/home/Home.tsx";
import {AUTH_STORAGE_KEY, defaultAuthState} from "./auth.ts";
import type {AuthState} from "./auth.ts";
import Reservation from "./pages/reservation/Reservation.tsx";

const getStoredAuthState = (): AuthState => {
  const savedAuthState = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!savedAuthState) {
    return defaultAuthState;
  }

  try {
    return JSON.parse(savedAuthState) as AuthState;
  } catch (error) {
    console.error("Chyba v autentikaci přihlášení: ", error);
    return defaultAuthState;
  }
};

function App() {
  const [authState, setAuthState] = useState<AuthState>(getStoredAuthState);

  useEffect(() => {
    if (authState.isLoggedIn && authState.role) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
      return;
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [authState]);

  return (
    <>

        <Header authState={authState} onLogout={() => setAuthState(defaultAuthState)} />
        <Routes >
            <Route path="/" element={<Home/>}></Route>
            <Route path="/dashboard" element={<Dashboard isLoggedIn={authState.isLoggedIn} role={authState.role} />}></Route>
            <Route
                path="/employee"
                element={
                    authState.isLoggedIn && authState.role === "ADM"
                        ? <PostUser />
                        : <Navigate to={authState.isLoggedIn ? "/dashboard" : "/login"} replace />
                }
            ></Route>
            <Route
                path="/employee/:id"
                element={
                    authState.isLoggedIn && authState.role === "ADM"
                        ? <UpdateUser />
                        : <Navigate to={authState.isLoggedIn ? "/dashboard" : "/login"} replace />
                }
            ></Route>
            <Route
                path="/reservation"
                element={
                    authState.isLoggedIn
                        ? <Reservation authState={authState} />
                        : <Navigate to="/login" replace />
                }
            ></Route>
            <Route path="*" element={<NoMatch/>}></Route>
            <Route path="/login" element={<Login authState={authState} onLogin={setAuthState} />}></Route>
        </Routes>
    </>
  );
}

export default App;
