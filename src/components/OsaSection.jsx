import React, { useState } from "react";
import Modal from "./Modal/Modal";

export default function OsaSection() {
  const initialAnswers = {
    name: "",
    email: "",
    phone: "",
    attendingWedding: "",
    dietaryRestrictions: "",
    dietaryDetails: "",
    attendanceDays: { friday: false, saturday: false, sunday: false },
    danceMusic: "",
    message: "",
  };

  const [answers, setAnswers] = useState(initialAnswers);
  const [submitted, setSubmitted] = useState(false);
  const [sendPressed, setSendPressed] = useState(false);

  // Reset form when modal opens
  const handleModalOpen = () => {
    setAnswers(initialAnswers);
    setSubmitted(false);
    setSendPressed(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Name", answers.name);
    formData.append("Email", answers.email);
    formData.append("Phone", answers.phone);
    formData.append("AttendingWedding", answers.attendingWedding);
    formData.append("DietaryRestrictions", answers.dietaryRestrictions);
    formData.append("DietaryDetails", answers.dietaryDetails);
    formData.append( "AttendanceDays_friday", answers.attendanceDays.friday ? "yes" : "no" ); 
    formData.append( "AttendanceDays_saturday", answers.attendanceDays.saturday ? "yes" : "no" ); 
    formData.append( "AttendanceDays_sunday", answers.attendanceDays.sunday ? "yes" : "no" );
    formData.append("DanceMusic", answers.danceMusic);
    formData.append("Message", answers.message);

    fetch(
      "https://script.google.com/macros/s/AKfycbzg5Lk--VbQE-MO0K7yOEyls1FnxY7UuxzV0g7HW7JAmrBYMpoP-WK_4VYLTilfar9J_A/exec",
      {
        method: "POST",
        body: formData,
      }
    )
      .then(() => {
        setSubmitted(true); // Show checkmark
      })
      .catch((err) => {
        console.error("Form submission failed:", err);
        alert("Något gick fel med formuläret. Försök igen.");
      });
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
              <h1>OSA</h1>
              <p>Fyll i formuläret nedan, en per person.</p>

              {submitted ? (
                <div className="submission-success">
                  <svg className="checkmark" viewBox="0 0 120 120" aria-hidden="true">
                    <circle className="checkmark__circle" cx="60" cy="60" r="54" />
                    <path className="checkmark__check" d="M34 62 L52 80 L86 44" />
                  </svg>
                  <p>Dina svar har blivit skickade! Tack!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Ditt namn"
                    value={answers.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    onInvalid={() => setSendPressed(false)}
                  />
                  <br />
                  <input
                    type="email"
                    placeholder="Din e-post"
                    value={answers.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    onInvalid={() => setSendPressed(false)}
                  />
                  <input
                    type="text"
                    placeholder="Ditt telefonnummer"
                    value={answers.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    onInvalid={() => setSendPressed(false)}
                  />
                  {/* Attending Wedding */}
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

                  {/* Dietary Restrictions */}
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
                        placeholder="Beskriv dina matpreferenser"
                        value={answers.dietaryDetails}
                        onChange={(e) => handleInputChange("dietaryDetails", e.target.value)}
                        style={{ marginTop: "8px" }}
                      />
                    )}
                  </div>

                  {/* Attendance Days */}
                  <div className="question-block">
                    <label>Vilka av dagarna kan du/ni närvara?</label>
                    <div className="checkbox-group">
                      {["friday", "saturday", "sunday"].map((day) => (
                        <label key={day} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={answers.attendanceDays[day]}
                            onChange={() => handleDayChange(day)}
                          />
                          {day === "friday"
                            ? "Fredag - Lekar, middag och mingel"
                            : day === "saturday"
                            ? "Lördag - Vigsel, middag och fest"
                            : "Söndag - Brunch (à 195 kr/person)"}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dance Music */}
                  <div className="question-block">
                    <label>Låt(-ar) som får dig upp på dansgolvet?</label>
                    <input
                      type="text"
                      placeholder="Låten som välter dansgolvet!"
                      value={answers.danceMusic}
                      onChange={(e) => handleInputChange("danceMusic", e.target.value)}
                      style={{ marginTop: "8px" }}
                    />
                  </div>

                  {/* Optional Message */}
                  <textarea
                    placeholder="Övriga meddelanden (valfritt)"
                    value={answers.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                  />

                  <button
                    type="submit"
                    className={`btn-modal ${sendPressed ? "selected" : ""}`}
                    onClick={() => setSendPressed(true)}
                  >
                    Skicka
                  </button>
                </form>
              )}
            </>
          </Modal>
        </div>

        <img src="./images/bordeaux_edit.jpg" alt="bordeaux" />
      </div>
    </section>
  );
}
