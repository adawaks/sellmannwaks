import React from "react";

export default function MapSection() {
  return (
    <section id="karta" style={{ padding: "0 20px", marginBottom: 40 }}>
      <h1>Var?</h1>
      <iframe
        className="map-frame"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2125.1882231505747!2d12.38820437726582!3d57.815124831291705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46455686e6634445%3A0x94ed9281dd017f55!2zTsOkw6RzIFbDpG5oZW0!5e0!3m2!1ssv!2sse!4v1762873106267!5m2!1ssv!2sse"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Karta"
      />
    </section>
  );
}
