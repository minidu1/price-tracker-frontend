import { useState } from "react";
import "./Signup.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function Login({onLogin}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
  });
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function clearForm() {
    setEmail("");
    setPassword("");
    setError({ emailError: "", passwordError: "" });
    setServerError("");
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true); // stop user from submit twice

    const newErrors = { emailError: "", passwordError: "" };

    if (email.trim() === "") {
      newErrors.emailError = "* Email is required";
    } else if (!/^.+@.+\..+$/.test(email)) {
      newErrors.emailError = "* Invalid email";
    }

    if (password.trim() === "") {
      newErrors.passwordError = "* Password cannot be empty";
    }

    try {
      setError(newErrors);
      if (Object.values(newErrors).some(Boolean)) return;
      const user = await loginUser(email, password);
      onLogin(user) // store user obj in parent componont(App.js) so any child can access user data to render
    } catch (error) {
      if (error instanceof TypeError) {
        setServerError("Unable to connect. Please try again later.");
      } else {
        setServerError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="signup">
      <h2>Login</h2>

      <form onSubmit={handleSubmit} noValidate>

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
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({email, password }),
    credentials: "include"
  });
  const data = await res.json();
  if (res.ok) {
    return data.user
  } else {
    throw new Error(data.message);
  }
}
