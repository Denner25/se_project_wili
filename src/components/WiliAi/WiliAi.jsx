import PageWithSidebar from "../PageWithSidebar/PageWithSidebar";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import useTargetUser from "../../hooks/useTargetUser";
import Autocomplete from "../Autocomplete/Autocomplete";
import { useState, useEffect } from "react";
import "./WiliAi.css";

function WiliAi({ onItemClick, resetAutocomplete, onEditProfile, onLogOut }) {
  const { profileUser, isOwner, loading } = useTargetUser();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery("");
  }, [resetAutocomplete]);

  if (loading || !profileUser) return <LoadingSpinner />;

  return (
    <PageWithSidebar
      profileUser={profileUser}
      isOwner={isOwner}
      onEditProfile={onEditProfile}
      onLogOut={onLogOut}
    >
      <h1 className="wili-ai__title">Would I like it?</h1>
      <div className="wili-ai__content">
        <p className="wili-ai__prompt">
          {isOwner
            ? "Ask Wili if you would like this suggestion:"
            : `Ask Wili if ${profileUser.name} would like your suggestion:`}
        </p>
        <Autocomplete
          onlyMedia={true}
          onSelect={onItemClick}
          query={query}
          setQuery={setQuery}
        />
        <button className="wili-ai__button">Generate AI response</button>
      </div>
    </PageWithSidebar>
  );
}

export default WiliAi;
