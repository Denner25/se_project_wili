import { createContext, useState, useCallback } from "react";

const ChatsContext = createContext();

function ChatsProvider({ children }) {
  const [chats, setChats] = useState([]);

  const removeChat = useCallback((chatId) => {
    setChats((prev) => prev.filter((c) => c._id !== chatId));
  }, []);

  return (
    <ChatsContext.Provider value={{ chats, setChats, removeChat }}>
      {children}
    </ChatsContext.Provider>
  );
}

export { ChatsContext, ChatsProvider };
