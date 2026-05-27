import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { getMessages, deleteMessage, createMessage } from "../../utils/Api";
import { ChatsContext } from "../../contexts/ChatsContext";
import Message from "../Message/Message";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import PageMotion from "../PageMotion/PageMotion";
import "./ChatView.css";

function ChatView({ items }) {
  const { chatId } = useParams();
  const { user: currentUser, token } = useContext(CurrentUserContext);
  const { removeChat } = useContext(ChatsContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatInfo, setChatInfo] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId || !token) return;

    setLoading(true);

    getMessages(chatId, token)
      .then((data) => {
        setMessages(data.messages || []);
        if (data.messages?.length > 0) {
          setChatInfo(data.messages[0].chat);
        }
        setError("");
      })
      .catch((err) => {
        console.error("Failed to load messages", err);
        setError("Could not load messages");
      })
      .finally(() => setLoading(false));
  }, [chatId, token]);

  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((m) => m._id !== messageId));

    deleteMessage(messageId, token)
      .then((res) => {
        if (res.chatDeleted) {
          removeChat(res.chatId);
          if (chatId === res.chatId) navigate("/profile/wili-ai");
        }
      })
      .catch((err) => {
        console.error("Failed to delete message", err);
      });
  };

  const handleSend = (text) => {
    if (!text.trim() || !chatInfo || generating) return;

    setInputText("");
    setGenerating(true);
    setError("");

    const targetUserId = chatInfo.aboutPerson.user.toString();

    const userLikes = items
      .map((item) => {
        const filteredMoods = (item.moods || []).filter((m) =>
          (m.users || []).map(String).includes(targetUserId)
        );
        if (!filteredMoods.length) return null;
        return { id: item._id, title: item.title, mediaType: item.mediaType };
      })
      .filter(Boolean);

    const ownerLikes = items
      .map((item) => {
        const filteredMoods = (item.moods || []).filter((m) =>
          (m.users || []).map(String).includes(currentUser._id.toString())
        );
        if (!filteredMoods.length) return null;
        return { id: item._id, title: item.title, mediaType: item.mediaType };
      })
      .filter(Boolean);

    const optimisticUserMsg = {
      _id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMsg]);

    createMessage({
      persist: true,
      ownerId: currentUser._id,
      aboutPersonId: chatInfo.aboutPerson.user,
      aboutPersonName: chatInfo.aboutPerson.nameSnapshot,
      candidate: {
        id: chatInfo.aboutItem.itemId,
        title: chatInfo.aboutItem.titleSnapshot,
        mediaType: chatInfo.aboutItem.itemType,
      },
      userLikes,
      ownerLikes,
      isOwner: currentUser._id === chatInfo.aboutPerson.user,
      targetName: chatInfo.aboutPerson.nameSnapshot,
      userMessage: text,
    })
      .then((resp) => {
        if (!resp) return;
        const newMessages = resp.chat?.messages?.slice(-2) || [];
        setMessages((prev) => [
          ...prev.filter((m) => m._id !== optimisticUserMsg._id),
          ...newMessages,
        ]);
      })
      .catch((err) => {
        console.error("Failed to send message", err);
        setError(err.message || "Failed to send message");
        setMessages((prev) =>
          prev.filter((m) => m._id !== optimisticUserMsg._id)
        );
      })
      .finally(() => setGenerating(false));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="chatview__error">{error}</p>;

  const aboutPersonName =
    chatInfo?.aboutPerson?.user === currentUser?._id
      ? "you"
      : chatInfo?.aboutPerson?.nameSnapshot || "Unknown";
  const aboutItemTitle = chatInfo?.aboutItem?.titleSnapshot || "Unknown Item";

  return (
    <PageMotion>
      <div className="chatview">
        {chatInfo && (
          <p className="chatview__title">
            You asked Wili if <strong>{aboutPersonName}</strong> would like{" "}
            <strong>{aboutItemTitle}</strong>.
          </p>
        )}

        <div className="chatview__messages">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <Message
                key={msg._id}
                message={msg}
                onDelete={handleDeleteMessage}
                onSuggest={handleSend}
              />
            ))
          ) : (
            <p className="chatview__empty">No messages in this chat yet</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatview__input-row">
          <input
            className="chatview__input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
            placeholder="Ask Wili anything..."
            disabled={generating}
          />
          <button
            className="chatview__send-btn"
            onClick={() => handleSend(inputText)}
            disabled={generating}
          >
            {generating ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" strokeDasharray="31.4" strokeDashoffset="10">
                  <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
                </circle>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </PageMotion>
  );
}

export default ChatView;