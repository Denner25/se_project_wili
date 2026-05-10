// src/components/ChatView/ChatView.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { getMessages, deleteMessage, createMessage } from "../../utils/Api";
import { ChatsContext } from "../../contexts/ChatsContext";
import Message from "../Message/Message";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import PageMotion from "../PageMotion/PageMotion";
import "./ChatView.css";

function ChatView({ token, items }) {
  const { chatId } = useParams();
  const currentUser = useContext(CurrentUserContext);
  const { removeChat } = useContext(ChatsContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatInfo, setChatInfo] = useState(null);
  const [generating, setGenerating] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages for this chat
  useEffect(() => {
  if (!chatId) return;

  // wait until token exists instead of bailing
  if (!token) return;

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

  // Delete message handler
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

  // Generate AI response for current chat with live user likes
  const handleGenerateResponse = () => {
    if (!chatInfo) return;

    setGenerating(true);
    setError("");

    const targetUserId = chatInfo.aboutPerson.user.toString();

    // Step 1: Use the items passed from props
    // Step 2: Build userLikes just like WiliAi
    const userLikes = items
      .map((item) => {
        const moods = item.moods || [];
        const filteredMoods = moods.filter((m) =>
          (m.users || []).map(String).includes(targetUserId),
        );
        if (!filteredMoods.length) return null;

        return {
          id: item._id,
          title: item.title,
          moods: filteredMoods.map((m) => m.name),
          mediaType: item.mediaType,
        };
      })
      .filter(Boolean);

    if (!userLikes.length) {
      setError("No liked items available for AI analysis");
      setGenerating(false);
      return;
    }

    // Step 3: Call createMessage with userLikes
    createMessage({
      persist: true,
      ownerId: currentUser._id,
      aboutPersonId: chatInfo.aboutPerson.user,
      aboutPersonName: chatInfo.aboutPerson.nameSnapshot,
      candidate: {
        id: chatInfo.aboutItem.itemId,
        title: chatInfo.aboutItem.titleSnapshot || chatInfo.aboutItem.title,
        mediaType: chatInfo.aboutItem.itemType,
      },
      userLikes, // passes items considered
      isOwner: currentUser._id === chatInfo.aboutPerson.user,
      targetName: chatInfo.aboutPerson.nameSnapshot || "there",
    })
      .then((resp) => {
        if (!resp) return;

        // Step 4: Add the new message to state
        const newMsg = resp.chat?.messages?.[resp.chat.messages.length - 1];
        if (newMsg) setMessages((prev) => [...prev, newMsg]);
      })
      .catch((err) => {
        console.error("Failed to generate response", err);
        setError(err.message || "Failed to generate response");
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
              />
            ))
          ) : (
            <p className="chatview__empty">No messages in this chat yet</p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <button
          className="chatview__generate-btn"
          onClick={handleGenerateResponse}
          disabled={generating}
        >
          {generating ? "Thinking..." : "Generate new AI response"}
        </button>
      </div>
    </PageMotion>
  );
}

export default ChatView;
