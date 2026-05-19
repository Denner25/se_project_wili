// src/components/Message/Message.jsx
import "./Message.css";

function Message({ message, onDelete, onSuggest }) {
  const timestamp = new Date(message.createdAt);
  const itemsConsidered = message.meta?.itemsConsidered ?? 0;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(message._id);
  };

  return (
    <div className={`message message--${message.role}`}>
      <button className="message__delete-btn" onClick={handleDelete} />

      {message.content && (
        <p className="message__content">{message.content}</p>
      )}

      {message.role === "assistant" && message.suggestedPrompts?.length > 0 && (
        <ul className="message__prompts">
          {message.suggestedPrompts.map((prompt, i) => (
            <li key={i}>
              <span
                className="message__prompt-link"
                onClick={() => onSuggest(prompt)}
              >
                {prompt}
              </span>
            </li>
          ))}
        </ul>
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