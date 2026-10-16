import Signup from "./components/Signup";
import Login from "./components/Login";
import { useState } from "react";

export default function App() {
  const [user, setUser] = useState(null);

  if (user === null) {
    return <Login onLogin={setUser} />;
  }
  return (
    <>
      <h1>Price Tracker</h1>
      <h2>Hi {user.name}</h2>
    </>
  );
}
