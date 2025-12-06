import React, { useState } from "react";
import Modal from "./Modal/Modal";

export default function OsaSection() {
  const [answers, setAnswers] = useState({
    attendingWedding: null,
    dietaryRestrictions: null,
    dietaryDetails: "",
    attendanceDays: {
      friday: false,
      saturday: false,
      sunday: false,
    },
    danceMusic: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'error' | null
  const [submissionMessage, setSubmissionMessage] = useState("");

  const handleAnswer = (question, answer) => {
    setAnswers(prev => ({ ...prev, [question]: answer }));
  };

  const handleDayChange = (day) => {
    setAnswers(prev => ({
      ...prev,
      attendanceDays: {
        ...prev.attendanceDays,
        [day]: !prev.attendanceDays[day],
      },
    }));
  };

  const handleInputChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a hidden iframe so we can submit the form without navigating away
    const iframeName = "gsSubmitFrame" + Date.now();
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    // Create a hidden form for submission to the Google Apps Script URL
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://script.google.com/macros/s/AKfycbzUefX98Nadjj9Pt5vQ4AMQ6vyNwofU6f6A_HR2hI995aLJLJ1P5ni-DZ7TXwZHW96PHA/exec";
    form.target = iframeName; // submit into hidden iframe
    form.style.display = "none";

    // Add form fields
    const fields = {
      name: document.querySelector('input[name="name"]').value,
      email: document.querySelector('input[name="email"]').value,
      attendingWedding: answers.attendingWedding,
      dietaryRestrictions: answers.dietaryRestrictions,
      dietaryDetails: answers.dietaryDetails,
      attendanceDays: Object.keys(answers.attendanceDays)
        .filter(day => answers.attendanceDays[day])
        .join(", "),
      danceMusic: answers.danceMusic,
      message: document.querySelector('textarea[name="message"]').value,
      _captcha: "false",
    };

    for (const [key, value] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value || "";
      form.appendChild(input);
    }

    // Submit the hidden form into the iframe (we assume success for the SPA)
    document.body.appendChild(form);
    form.submit();

    // Immediately show success UI (we'll send confirmation email separately)
    setSubmissionStatus("success");
    setSubmissionMessage("Tack för ditt svar!");

    // cleanup temporary DOM nodes after a short delay
    setTimeout(() => {
      if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
      if (form && form.parentNode) form.parentNode.removeChild(form);
    }, 2000);

    // Reset local form state immediately (UI cleared)
    setAnswers({
      attendingWedding: null,
      dietaryRestrictions: null,
      dietaryDetails: "",
      attendanceDays: { friday: false, saturday: false, sunday: false },
      danceMusic: "",
    });
  };

  return (
    <section id="OSA" className="centered-block">
      <div className="two-column">
        
        <div>
          <h1>OSA snarast </h1>
          <h2>(men senast 30:e april)</h2>
          <div style={{ height: 12 }} />

          <Modal buttonLabel="Öppna OSA-formulär">
            <>
            <h2>OSA</h2>
            <p>Fyll i formuläret nedan:</p>

            {submissionStatus === 'success' ? (
              <div className="submission-success" role="status" aria-live="polite">
                <svg className="checkmark" viewBox="0 0 120 120" aria-hidden="true">
                  <circle className="checkmark__circle" cx="60" cy="60" r="54" />
                  <path className="checkmark__check" d="M34 62 L52 80 L86 44" />
                </svg>
                <p>Dina svar har blivit skickade. Kolla din mail för bekräftelse att svaren blivit skickade som de ska.</p>
              </div>
            ) : (
              <>
              {submissionStatus === 'error' && (
                <div className={`submission-message ${submissionStatus}`} style={{ marginBottom: 12 }}>
                  {submissionMessage}
                </div>
              )}

            <form onSubmit={handleSubmit} noValidate>
              <input type="hidden" name="_captcha" value="false" />

              <input type="text" name="name" placeholder="Ditt namn" required />
              <br></br>
              <input type="email" name="email" placeholder="Din e-post" required />

              {/* Question 1 */}
              <div className="question-block">
                <label>Kommer du på bröllopet?</label>
                <div className="button-group">
                  <button
                    type="button"
                    className={`yes-no-btn ${answers.attendingWedding === "yes" ? "selected" : ""}`}
                    onClick={() => handleAnswer("attendingWedding", "yes")}
                  >
                    JAAAAAA!!!!
                  </button>
                  <button
                    type="button"
                    className={`yes-no-btn ${answers.attendingWedding === "no" ? "selected" : ""}`}
                    onClick={() => handleAnswer("attendingWedding", "no")}
                  >
                    Nej
                  </button>
                </div>
              </div>

              {/* Question 2 */}
              <div className="question-block">
                <label>Har du några matpreferenser?</label>
                <div className="button-group">
                  <button
                    type="button"
                    className={`yes-no-btn ${answers.dietaryRestrictions === "yes" ? "selected" : ""}`}
                    onClick={() => handleAnswer("dietaryRestrictions", "yes")}
                  >
                    Ja
                  </button>
                  <button
                    type="button"
                    className={`yes-no-btn ${answers.dietaryRestrictions === "no" ? "selected" : ""}`}
                    onClick={() => handleAnswer("dietaryRestrictions", "no")}
                  >
                    Nej
                  </button>
                </div>
                {answers.dietaryRestrictions === "yes" && (
                  <input
                    type="text"
                    name="dietaryDetails"
                    placeholder="Beskriv dina matpreferenser"
                    value={answers.dietaryDetails}
                    onChange={(e) => handleInputChange("dietaryDetails", e.target.value)}
                    required
                    style={{ marginTop: "8px" }}
                  />
                )}
              </div>

              {/* Question 3 - Days attendance */}
              <div className="question-block">
                <label>Vilka av dagarna kan du/ni närvara?</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={answers.attendanceDays.friday}
                      onChange={() => handleDayChange("friday")}
                    />
                    Fredag - Lekar, middag och mingel
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={answers.attendanceDays.saturday}
                      onChange={() => handleDayChange("saturday")}
                    />
                    Lördag - Vigsel, middag och fest
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={answers.attendanceDays.sunday}
                      onChange={() => handleDayChange("sunday")}
                    />
                    Söndag - Brunch
                  </label>
                </div>
              </div>

              {/* Question 5 - Dance music */}
              <div className="question-block">
                <label>Låt(-ar) som får dig upp på dansgolvet?</label>
                <input
                  type="text"
                  name="danceMusic"
                  placeholder="Låten som välter dansgolvet!"
                  value={answers.danceMusic}
                  onChange={(e) => handleInputChange("danceMusic", e.target.value)}
                  style={{ marginTop: "8px" }}
                />
              </div>

              <textarea name="message" placeholder="Övriga meddelanden (valfritt)" />

              <button type="submit" className="btn-modal">
                Skicka
              </button>
            </form>
            </>
            )}
            </>
          </Modal>
        </div>

        <img src="/images/bordeaux_edit.jpg" alt="bordeaux" />
      </div>
    </section>
  );
}
