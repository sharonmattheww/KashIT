import { useEffect, useRef } from 'react';

/**
 * Accessible modal dialog. Closes on Escape and on overlay click, locks body
 * scroll while open, moves focus inside on open and restores it on close.
 */
export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);
  const titleId = 'modal-title';

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    // Move focus to the first focusable control in the dialog.
    dialogRef.current?.querySelector('input, select, textarea, button')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <h2 className="modal__title" id={titleId}>
            {title}
          </h2>
          <button type="button" className="btn btn--icon" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
