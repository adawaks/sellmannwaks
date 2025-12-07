import React, { useState } from "react";
import Modal from "./Modal/Modal";

// Replace YOUR_SCRIPT_URL with your apps script URL if different
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzw5tLas-Za0AXm1oHUzb2Z4AdQe7yIt_AFdDW4pjr2db8J9Aj4PHsBR61w_QCgGz3PsQ/exec";

export default function OsaSection() {
  const initialAnswers = {
    name: "",
    email: "",
    attendingWedding: "",
    dietaryRestrictions: "",
    dietaryDetails: "",
    attendanceDays: { friday: false, saturday: false, sunday: false },
    danceMusic: "",
    message: "",
  };

  const [answers, setAnswers] = useState(initialAnswers);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // spinner while native POST is happening

  // Reset form when modal opens
  const handleModalOpen = () => {
    setAnswers(initialAnswers);
    setSubmitted(false);
    setLoading(false);
  };

  const handleAnswer = (question, answer) =>
    setAnswers((prev) => ({ ...prev, [question]: answer }));

  const handleDayChange = (day) =>
    setAnswers((prev) => ({
      ...prev,
      attendanceDays: { ...prev.attendanceDays, [day]: !prev.attendanceDays[day] },
    }));

  const handleInputChange = (field, value) =>
    setAnswers((prev) => ({ ...prev, [field]: value }));

  // Called by iframe onLoad when the POST response finishes
  const handleIframeLoad = () => {
    // Only treat as "done" if we are currently loading (avoids initial iframe load)
    if (!loading) return;
    setLoading(false);
    setSubmitted(true);
    // keep the checkmark visible until modal closed (we don't auto-reset here)
  };

  return (
    <section id="OSA" className="centered-block">
      <div className="two-column">
        <div>
          <h1>OSA snarast</h1>
          <h2>(men senast 30:e april)</h2>
          <div style={{ height: 12 }} />

          <Modal buttonLabel="Öppna OSA-formulär" onOpen={handleModalOpen}>
            <>
              <h2>OSA</h2>
              <p>Fyll i formuläret nedan:</p>

              {/* show checkmark only when submitted; stays until modal closed */}
              {submitted ? (
                <div className="submission-success">
                  <svg className="checkmark" viewBox="0 0 120 120" aria-hidden="true">
                    <circle className="checkmark__circle" cx="60" cy="60" r="54" />
                    <path className="checkmark__check" d="M34 62 L52 80 L86 44" />
                  </svg>
                  <p>Dina svar har blivit skickade! Tack!</p>
                </div>
              ) : null}

              {/* Hidden iframe to receive the native POST; onLoad = submission finished */}
              <iframe
                name="hidden_iframe"
                title="hidden_iframe"
                style={{ display: "none" }}
                onLoad={handleIframeLoad}
              />

              {/* Native form posting to Apps Script, target the hidden iframe */}
              {/* IMPORTANT: onSubmit must NOT call e.preventDefault() — use native POST */}
              <form
                action={APPS_SCRIPT_URL}
                method="POST"
                target="hidden_iframe"
                onSubmit={() => {
                  // start spinner, let the browser perform the native POST
                  setLoading(true);
                }}
                // keep the form visible while loading so the browser can read values
              >
                {/* Add name attributes so the native form POST sends them */}
                <input
                  type="text"
                  name="Name"
                  placeholder="Ditt namn"
                  value={answers.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
                <br />
                <input
                  type="email"
                  name="Email"
                  placeholder="Din e-post"
                  value={answers.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />

                {/* Attending Wedding */}
                <div className="question-block">
                  <label>Kommer du på bröllopet?</label>
                  <div className="button-group">
                    <button
                      type="button"
                      className={answers.attendingWedding === "yes" ? "selected" : ""}
                      onClick={() => handleAnswer("attendingWedding", "yes")}
                    >
                      JAAAAAA!!!!
                    </button>
                    <button
                      type="button"
                      className={answers.attendingWedding === "no" ? "selected" : ""}
                      onClick={() => handleAnswer("attendingWedding", "no")}
                    >
                      Nej
                    </button>
                  </div>
                  {/* hidden input to carry the yes/no value */}
                  <input type="hidden" name="AttendingWedding" value={answers.attendingWedding} />
                </div>

                {/* Dietary Restrictions */}
                <div className="question-block">
                  <label>Har du några matpreferenser?</label>
                  <div className="button-group">
                    <button
                      type="button"
                      className={answers.dietaryRestrictions === "yes" ? "selected" : ""}
                      onClick={() => handleAnswer("dietaryRestrictions", "yes")}
                    >
                      Ja
                    </button>
                    <button
                      type="button"
                      className={answers.dietaryRestrictions === "no" ? "selected" : ""}
                      onClick={() => handleAnswer("dietaryRestrictions", "no")}
                    >
                      Nej
                    </button>
                  </div>
                  <input
                    type="hidden"
                    name="DietaryRestrictions"
                    value={answers.dietaryRestrictions}
                  />
                  {answers.dietaryRestrictions === "yes" && (
                    <input
                      type="text"
                      name="DietaryDetails"
                      placeholder="Beskriv dina matpreferenser"
                      value={answers.dietaryDetails}
                      onChange={(e) => handleInputChange("dietaryDetails", e.target.value)}
                      style={{ marginTop: "8px" }}
                    />
                  )}
                </div>

                {/* Attendance Days — controlled checkboxes + hidden inputs for POST */}
                <div className="question-block">
                  <label>Vilka av dagarna kan du/ni närvara?</label>
                  <div className="checkbox-group">
                    {["friday", "saturday", "sunday"].map((day) => (
                      <label key={day} className="checkbox-label">
                        <input
                          type="checkbox"
                          // keep checkbox controlled so UI updates
                          checked={answers.attendanceDays[day]}
                          onChange={() => handleDayChange(day)}
                        />
                        {/* hidden input contains yes/no so Apps Script always receives a value */}
                        <input
                          type="hidden"
                          name={`AttendanceDays_${day}`}
                          value={answers.attendanceDays[day] ? "yes" : "no"}
                        />
                        {day === "friday"
                          ? "Fredag - Lekar, middag och mingel"
                          : day === "saturday"
                          ? "Lördag - Vigsel, middag och fest"
                          : "Söndag - Brunch"}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dance Music */}
                <div className="question-block">
                  <label>Låt(-ar) som får dig upp på dansgolvet?</label>
                  <input
                    type="text"
                    name="DanceMusic"
                    placeholder="Låten som välter dansgolvet!"
                    value={answers.danceMusic}
                    onChange={(e) => handleInputChange("danceMusic", e.target.value)}
                    style={{ marginTop: "8px" }}
                  />
                </div>

                {/* Optional Message */}
                <textarea
                  name="Message"
                  placeholder="Övriga meddelanden (valfritt)"
                  value={answers.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />

                {/* Submit button: show spinner while native POST is in progress */}
                <button
                  type="submit"
                  className={loading ? "buttonload" : "btn-modal"}
                  // don't disable the button immediately — disabling before browser builds the POST
                  // can sometimes cancel the navigation. If you want to guard double-clicks you can
                  // use a small timeout or check `loading` in the iframe onLoad logic.
                >
                  {loading ? (
                    <>
                      <i className="fa fa-spinner fa-spin" /> Skickar...
                    </>
                  ) : (
                    "Skicka"
                  )}
                </button>
              </form>
            </>
          </Modal>
        </div>

        <img src="./images/bordeaux_edit.jpg" alt="bordeaux" />
      </div>
    </section>
  );
}
