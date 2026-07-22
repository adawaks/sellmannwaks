import React, { useState } from "react";

function BilderLink() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const correctPassword = "bilder";

  const openGallery = () => {

    if (password === correctPassword) {
      window.open("/bilder", "_blank");
      setPassword("");
      setShowPassword(false);
    } else {
      alert("Fel lösenord");
    }

  };


  return (
    <div className="peach-block bilder-section">

      <h1>Bilder</h1>

      <p>
        Här kommer bilder från vårt bröllop att samlas.
        Klicka nedan för att öppna bildgalleriet.
      </p>


      {!showPassword && (
        <button
          className="bilder-button"
          onClick={() => setShowPassword(true)}
        >
          Öppna bildgalleri
        </button>
      )}


      {showPassword && (
        <div>

          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          <button
            className="bilder-button"
            onClick={openGallery}
          >
            Logga in
          </button>

        </div>
      )}

    </div>
  );
}

export default BilderLink;