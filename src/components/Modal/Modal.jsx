import React, { useState, useEffect, useRef } from "react";
import "./Modal.css";

export default function Modal({
  buttonLabel,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onOpen,
  children,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const wasOpen = useRef(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledOpen;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      if (!wasOpen.current) {
        onOpen && onOpen(); // Reset form only on first open
        wasOpen.current = true;
      }
    } else {
      document.body.classList.remove("modal-open");
      wasOpen.current = false;
    }
  }, [isOpen, onOpen]);

  const open = () => {
    if (isControlled) return;
    setUncontrolledOpen(true);
  };

  const close = () => {
    if (isControlled) controlledOnClose && controlledOnClose();
    else setUncontrolledOpen(false);
  };

  return (
    <>
      {buttonLabel && (
        <button type="button" className="modal-open-btn" onClick={open}>
          {buttonLabel}
        </button>
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
