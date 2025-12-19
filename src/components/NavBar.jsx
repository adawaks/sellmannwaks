import React, { useState, useRef, useEffect } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <nav
        id="navbar"
        className="banner"
        role="navigation"
        aria-label="Top navigation"
      >
        {/* Hamburger */}
        <button
          ref={buttonRef}
          className="hamburger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          ☰
        </button>

        {/* Desktop links */}
        <div className="nav-links">
          <a href="#OSA">OSA</a>
          <a href="#karta">Var?</a>
          <a href="#schema">Helgens schema</a>
          <a href="#toast">Toastmasters</a>
          <a href="#top" className="brand">Sellmann Waks</a>
          <a href="#boende">Boende</a>
          <a href="#foto">Fotografering</a>
          <a href="#barn">Barn</a>
          <a href="#presenter">Presenter</a>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div ref={menuRef} className="mobile-menu">
          <a href="#OSA" onClick={closeMenu}>OSA</a>
          <a href="#karta" onClick={closeMenu}>Var?</a>
          <a href="#schema" onClick={closeMenu}>Helgens schema</a>
          <a href="#toast" onClick={closeMenu}>Toastmasters</a>
          <a href="#boende" onClick={closeMenu}>Boende</a>
          <a href="#foto" onClick={closeMenu}>Fotografering</a>
          <a href="#barn" onClick={closeMenu}>Barn</a>
          <a href="#presenter" onClick={closeMenu}>Presenter</a>
        </div>
      )}
    </>
  );
}
