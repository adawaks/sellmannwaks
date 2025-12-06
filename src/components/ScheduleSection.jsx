import React from "react";

function EventBox({ time, title, location, body, dress }) {
  return (
    <div className="event-box">
      <div className="event-time">{time}</div>
      <div className="event-info">
        <strong>{title}</strong>
        <div style={{ height: 6 }} />
        <div>{location}</div>
        <div style={{ height: 10 }} />
        <div>{body}</div>
        {dress && (
          <>
            <div style={{ height: 8 }} />
            <em>{dress}</em>
          </>
        )}
      </div>
    </div>
  );
}

export default function ScheduleSection() {
  return (
    <section id="schema" style={{ padding: "0 20px" }}>
      <h1>Helgens schema</h1>

      <EventBox
        time="Tid: 16:00 – 21:00"
        title="Lekar, mingel och middag"
        location="Samling framför Vänhem (Otto Salomons väg 8, 448 92 Floda)"
        body="Helgen inleds med lekar och tävling kl. 16–19, därefter blir det middag och mingel. Självklart kommer vinnare att utses."
        dress="Klädsel: Oöm, passande för sommarkväll"
      />

      <EventBox
        time="Tid: 14:00 – 02:00"
        title="Bröllopsdagen"
        location="Framför Vänhem (Otto Salomons väg 8, 448 92 Floda)"
        body="Vigsel, middag och fest!"
        dress="Klädsel: Kavaj"
      />

      <EventBox
        time="Tid: 10:00 – 12:00"
        title="Brunch"
        location="Kaffestugan, Nääs Slott (Nääs allé 12, 448 92 Floda)"
        body="Helgen avrundas med brunch."
        dress="Klädsel: Sommarledigt"
      />
    </section>
  );
}
