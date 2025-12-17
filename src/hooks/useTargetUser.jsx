import { useContext } from "react";
import { useParams } from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext";
import useUser from "./useUser";

export default function useTargetUser() {
  const currentUser = useContext(CurrentUserContext);
  const { userId } = useParams();

  const targetId = userId || currentUser?._id;
  const { profileUser, loading } = useUser(targetId);

  const isOwner = profileUser?._id === currentUser?._id;

  return {
    profileUser,
    isOwner,
    loading,
    targetId,
  };
}
