import Signup from "./components/Signup";
import Login from "./components/Login";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  
  const [user, setUser] = useState(); //undefined means still checking the user

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
        }
        throw new Error(data.message);
      }
    } catch (err) {
      console.log(err.message);
      setUser(null)
    }
  }
    checkAuth();
  }, []);

  //if user undefined it means fetch is still happeninhg. so loadinhg screen shows
  if (user === undefined){ 
    return <p>Loading ....</p>
  }

  //if no user found login screen shows
  if (user === null) {
    return <Login onLogin={setUser} />;
  }

  //if user found render
  return (
    <>
      <h1>Price Tracker</h1>
      <h2>Hi {user.name}</h2>
    </>
  );
}
