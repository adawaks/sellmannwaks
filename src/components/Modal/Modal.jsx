import React, { useEffect, useState } from "react";
import "./Modal.css";

export default function Modal({ buttonLabel, isOpen: controlledIsOpen, onClose: controlledOnClose, children }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledOpen;

  useEffect(() => {
    if (isOpen) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  const open = () => {
    if (isControlled) return;
    setUncontrolledOpen(true);
  };

  const close = () => {
    if (isControlled) {
      controlledOnClose && controlledOnClose();
    } else {
      setUncontrolledOpen(false);
    }
  };

  return (
    <>
      {buttonLabel && (
        <button type="button" className="modal-open-btn" onClick={open}>{buttonLabel}</button>
      )}

      {isOpen && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={close}>×</button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
