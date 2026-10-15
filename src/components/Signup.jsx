import { useState } from "react";
import "./Signup.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
    nameError: "",
  });
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
    setError({ nameError: "", emailError: "", passwordError: "" });
    setServerError("");
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setServerError("")

    const newErrors = { nameError: "", emailError: "", passwordError: "" };

    if (name.trim() === "") {
      newErrors.nameError = "* Name is required";
    } else if (name.trim().length < 3 || name.trim().length > 32) {
      newErrors.nameError = "* Name must be between 3 to 32 characters";
    }

    if (email.trim() === "") {
      newErrors.emailError = "* Email is required";
    } else if (!/^.+@.+\..+$/.test(email)) {
      newErrors.emailError = "* Invalid email";
    }

    if (password.trim() === "") {
      newErrors.passwordError = "* Password cannot be empty";
    } else if (password.length < 6) {
      newErrors.passwordError = "* Password must be at least 6 characters";
    }

    try {
    setIsLoading(true); // show loading state

      setError(newErrors);
      if (Object.values(newErrors).some(Boolean)) return;
      await createAccount(name, email, password);
      clearForm();
      alert("Signup complete");
    } catch (err) {
      if (err instanceof TypeError) {
        setServerError("Unable to connect. Please try again later.");
      } else {
        setServerError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="signup">
      <h2>Sign up</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <div>
            <label htmlFor="name">Name</label>
            <span className="error" aria-live="polite">
              {error.nameError}
            </span>
          </div>
          <input
            id="name"
            type="text"
            value={name} //show the name on textbox
            //show the result when user type the name
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>

        <div className="form-group">
          <div>
            <label htmlFor="email">Email</label>
            <span className="error" aria-live="polite">
              {error.emailError}
            </span>
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              const input = e.target;
              setEmail(input.value);
            }}
          />
        </div>

        <div className="form-group">
          <div>
            <label htmlFor="password">Password</label>
            <span className="error" aria-live="polite">
              {error.passwordError}
            </span>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        {/* button disable if while fetch happen */}
        <div className="error">{serverError}</div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Login..." : "Login"}
        </button>
      </form>
    </div>
  );
}

async function createAccount(name, email, password) {
  const res = await fetch(`${API_URL}/users`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    console.log(res.status, data);
  } else {
    throw new Error(data.message);
  }
}
