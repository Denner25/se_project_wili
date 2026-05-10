// src/components/WiliAi/WiliAi.jsx
import { useState, useEffect, useContext } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Autocomplete from "../Autocomplete/Autocomplete";
import useTargetUser from "../../hooks/useTargetUser";
import useAuth from "../../hooks/useAuth";
import { createMessage } from "../../utils/Api";
import getFirstName from "../../utils/getFirstName";
import PageMotion from "../PageMotion/PageMotion";
import { ChatsContext } from "../../contexts/ChatsContext";
import "./WiliAi.css";

function WiliAi({ items, resetAutocomplete }) {
  const { profileUser, isOwner, loading } = useTargetUser();
  const { currentUser } = useAuth();
  const { chats, setChats } = useContext(ChatsContext);

  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [chat, setChat] = useState(null);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [error, setError] = useState("");

  const targetFirstName = getFirstName(profileUser?.name);

  useEffect(() => {
    setQuery("");
    setSelectedItem(null);
    setChat(null);
  }, [resetAutocomplete]);

  if (loading) return <LoadingSpinner />;

  const handleGenerateResponse = () => {
    if (!selectedItem) {
      setError("Please select an item to ask about");
      return;
    }

    setLoadingResponse(true);
    setError("");
    setChat(null);

    const userLikes = items
      .map((item) => {
        const moods = item.moods || [];
        const filteredMoods = moods.filter((m) =>
          m.users.includes(profileUser._id),
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
      setLoadingResponse(false);
      return;
    }

    createMessage({
      persist: true,
      ownerId: currentUser._id,
      aboutPersonId: profileUser._id,
      aboutPersonName: profileUser.name,
      candidate: selectedItem,
      userLikes,
      isOwner,
      targetName: targetFirstName,
    })
      .then((data) => {
        // --- Show only the latest AI message in WiliAi ---
        const latestMessage = data.chat?.messages?.at(-1) || null;
        setChat({
          ...data.chat,
          messages: latestMessage ? [latestMessage] : [],
        });

        // --- Safely add the chat to sidebar without duplicates ---
        setChats((prev) => {
          const exists = prev.some((c) => c._id === data.chat._id);
          if (exists) return prev;
          return [data.chat, ...prev];
        });
      })
      .catch((err) => {
        console.error("WiliAi Exception:", err);
        setError("Failed to get WiliAi response");
      })
      .finally(() => setLoadingResponse(false));
  };

  return (
    <PageMotion>
      <h1 className="wili-ai__title">Would I like it?</h1>

      <div className="wili-ai__content">
        <p className="wili-ai__prompt">
          {isOwner
            ? "Ask Wili if you would like this suggestion:"
            : `Ask Wili if ${targetFirstName} would like your suggestion:`}
        </p>

        <Autocomplete
          onlyMedia
          query={query}
          setQuery={setQuery}
          onSelect={setSelectedItem}
          selectedItem={selectedItem}
          lockSelectedValue
        />

        {error && <p className="wili-ai__error">{error}</p>}

        <div className="wili-ai__results">
          {chat?.messages?.map((message) => (
            <p key={message._id}>{message.content}</p>
          ))}
        </div>

        <button
          className="wili-ai__button"
          onClick={handleGenerateResponse}
          disabled={loadingResponse}
        >
          {loadingResponse ? "Thinking..." : "Generate AI response"}
        </button>
      </div>
    </PageMotion>
  );
}

export default WiliAi;
