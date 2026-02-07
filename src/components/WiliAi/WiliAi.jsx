import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import Autocomplete from "../Autocomplete/Autocomplete";

import { getWiliResponse } from "../../utils/Api";
import getFirstName from "../../utils/getFirstName";

import "./WiliAi.css";

function WiliAi({ items, resetAutocomplete }) {
  const { profileUser, isOwner } = useOutletContext();

  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [wiliResult, setWiliResult] = useState([]);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [error, setError] = useState("");
  const targetFirstName = getFirstName(profileUser?.name);

  useEffect(() => {
    setQuery("");
    setSelectedItem(null);
  }, [resetAutocomplete]);

  const handleGenerateResponse = async () => {
    if (!selectedItem) {
      setError("Please select an item to ask about");
      return;
    }

    setLoadingResponse(true);
    setError("");

    try {
      const userLikes = items
        .map((item) => {
          const moods = item.moods || [];
          const filteredMoods = moods.filter((m) =>
            m.users.includes(profileUser._id)
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
        return;
      }

      const data = await getWiliResponse({
        userLikes,
        candidate: selectedItem,
        isOwner,
        targetName: targetFirstName,
      });

      setWiliResult(data);
    } catch (err) {
      console.error("WiliAi Exception:", err);
      setError("Failed to get WiliAi response");
    } finally {
      setLoadingResponse(false);
    }
  };

  return (
    <>
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
          {wiliResult.map((item, i) => (
            <p key={i}>{item}</p>
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
    </>
  );
}

export default WiliAi;
