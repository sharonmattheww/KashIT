// A neutral placeholder used when a list or the whole month has no data yet.
// Empty screens are an invitation to act, so it can carry an action button.
export default function EmptyState({ icon = '◵', title, message, action }) {
  return (
    <div className="empty">
      <span className="empty__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="empty__title">{title}</p>
      {message && <p className="empty__message">{message}</p>}
      {action}
    </div>
  );
}
