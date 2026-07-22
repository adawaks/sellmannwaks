import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BilderLink() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const correctPassword = "bilder";

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password.trim() === correctPassword) {
      sessionStorage.setItem("galleryAccess", "granted");
      setError("");
      navigate("/bilder");
      return;
    }

    setError("Fel lösenord. Försök igen.");
  };

  return (
    <section className="bilder-link-section">
      <h1>Bildgalleri</h1>

      <p>Ange lösenordet för att öppna bildgalleriet.</p>

      <form
        className="bilder-password-form"
        onSubmit={handleSubmit}
      >
        <input
          className="bilder-password-input"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          placeholder="Lösenord"
          autoComplete="current-password"
          aria-label="Lösenord till bildgalleriet"
        />

        <button
          className="bilder-link-button"
          type="submit"
        >
          Öppna bildgalleri
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="bilder-password-error"
        >
          {error}
        </p>
      )}
    </section>
  );
}