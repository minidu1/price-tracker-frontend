import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [user, setUser] = useState(); //undefined means still checking the user

  async function logout() {
    try {
      const res = await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          if (res.status === 401) {
            setUser(null);
            return;
          }
          throw new Error(data.message);
        }
      } catch (err) {
        console.log(err.message);
        setUser(null);
      }
    }
    checkAuth();
  }, []);

  //if user undefined it means fetch is still happeninhg. so loadinhg screen shows
  if (user === undefined) {
    return <p>Loading ....</p>;
  }

  return (
    <>
      <div className="container">
        <h1>Price Tracker</h1>

        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" replace /> : <Login onLogin={setUser} />
            }
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" replace /> : <Signup />}
          />
          <Route
            path="/"
            element={
              user ? (
                <Dashboard user={user} onLogout={logout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
