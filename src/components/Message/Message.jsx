// src/components/Message/Message.jsx
import "./Message.css";

function Message({ message, onDelete }) {
  const timestamp = new Date(message.createdAt);
  const itemsConsidered = message.meta?.itemsConsidered ?? 0; // <-- get from meta

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(message._id);
  };

  return (
    <div className="message">
      <button className="message__delete-btn" onClick={handleDelete} />

      {message.content && (
        <p className="message__ai-response">{message.content}</p>
      )}

      <span className="message__timestamp">
        {itemsConsidered > 0 && `Items considered: ${itemsConsidered}`}
      </span>

      <span className="message__timestamp">
        {timestamp.toLocaleDateString()} ·{" "}
        {timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}

export default Message;
