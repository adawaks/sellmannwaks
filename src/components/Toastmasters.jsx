import React from "react";

export default function Toastmasters() {
  return (
    <section id="toast" style={{ padding: "0 20px" }}>
      <div className="three-column">
        
        {/* LEFT IMAGE */}
        <img src="./images/toast_robin.jpg" alt="Toastmasters Left" />

        {/* TEXT COLUMN */}
        <div className="peach-block">
          <h1>Toastmasters</h1>
          <p>
            Under lördagen kommer vårt fantastiska toastmasterteam att leda oss genom kvällen.
            Vill ni hålla tal, spexa lite eller hitta på något annat under bröllopshelgen?
            <br /><br />
            Kontakta:
            <a href="mailto:lestoasts.adamochlotta@gmail.com"> lestoasts.adamochlotta@gmail.com</a>
          </p>

          <form
            action="https://formsubmit.co/lestoasts.adamochlotta@gmail.com"
            method="POST"
            target="_blank"
            noValidate
          >
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="name" placeholder="Ditt namn" required />
            <input type="email" name="email" placeholder="Din e-post" required />
            <textarea name="message" placeholder="Meddelande" required />
            <button type="submit">Skicka</button>
          </form>
        </div>

        {/* RIGHT IMAGE */}
        <img src="./images/toast_trulls_edit.jpg" alt="Toastmasters Right" />
      </div>
    </section>
  );
}
