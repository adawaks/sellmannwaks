import React, { useState } from "react";

function Tooltip({ text }) {
  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "#fff",
        color: "#000",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        width: "350px",
        zIndex: 1000,
      }}
    >
      {text}
    </div>
  );
}

function EventBox({ time, title, location, body, dress, dressTooltip }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipPos({ x: rect.left, y: rect.bottom + window.scrollY });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => setShowTooltip(false);

  return (
    <div className="event-box" style={{ position: "relative" }}>
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
            <em>
              <span
                onMouseEnter={dressTooltip ? handleMouseEnter : null}
                onMouseLeave={dressTooltip ? handleMouseLeave : null}
                style={{ textDecoration: dressTooltip ? "underline dotted" : "none", cursor: dressTooltip ? "pointer" : "default" }}
              >
                {dress}
              </span>
            </em>
            {showTooltip && <Tooltip text={dressTooltip} style={{ top: tooltipPos.y, left: tooltipPos.x }} />}
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
        time="Fredag 16:00 – 21:00"
        title="Lekar, mingel och middag"
        location="Samling framför Vänhem (Otto Salomons väg 8, 448 92 Floda)"
        body="Helgen inleds med lekar och tävling kl. 16–19, därefter blir det middag och mingel. Självklart kommer vinnare att utses."
        dress="Klädsel: Oöm, passande för sommarkväll"
      />

      <EventBox
        time="Lördag 14:00 – 02:00"
        title="Bröllopsdagen"
        location="Framför Vänhem (Otto Salomons väg 8, 448 92 Floda)"
        body="Vigsel, middag och fest!"
        dress="Klädsel: Kavaj"
        dressTooltip="Kavaj är i dagsläget den minst strikta klädkoden, den innebär oftast en hel kostym för mannen. Kavaj och byxa skall matcha. Kostymen kan vara både ljus och mörk, det beror på sammanhanget och årstiden. Skjortan bör vara ljus, det är även tillåtet att använda fluga istället för slips. Kvinnor har stor valmöjlighet och kan bära klänning, kjol, dräkt eller byxdress men kläderna skall vara elegantare än vardagsklädsel."
      />

      <EventBox
        time="Söndag 10:00 – 12:00"
        title="Brunch"
        location="Kaffestugan, Nääs Slott (Nääs allé 12, 448 92 Floda)"
        body={
          <>
            Helgen avrundas med brunch som anordnas av Nääs slott.
            <br />
            Pris: 195 kr/person, swisha gärna Lotta på 0724474008.
          </>
        }
        dress="Klädsel: Sommarledigt"
      />
    </section>
  );
}
