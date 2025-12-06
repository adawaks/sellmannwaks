import React, { useState } from "react";

export default function OsaSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  const url =
    "https://script.google.com/macros/s/AKfycbzUefX98Nadjj9Pt5vQ4AMQ6vyNwofU6f6A_HR2hI995aLJLJ1P5ni-DZ7TXwZHW96PHA/exec";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        console.error("Server Error:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="osa-form-section">
      <h2>OSA – RSVP</h2>

      <form onSubmit={onSubmit}>
        <input
          name="name"
          placeholder="Namn"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Meddelande"
          value={formData.message}
          onChange={handleChange}
        />

        <button type="submit">Skicka OSA</button>
      </form>

      {status === "sending" && <p>Skickar...</p>}
      {status === "success" && <p style={{ color: "green" }}>Tack! Ditt svar är skickat.</p>}
      {status === "error" && (
        <p style={{ color: "red" }}>
          Ett fel uppstod. Prova igen eller kontakta oss direkt.
        </p>
      )}
    </section>
  );
}
