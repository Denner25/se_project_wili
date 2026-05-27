import { createContext } from "react";

// Now carries both user and token so child components
// never need to call useAuth() directly
const CurrentUserContext = createContext({ user: null, token: null });

export default CurrentUserContext;