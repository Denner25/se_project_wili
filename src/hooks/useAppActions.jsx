import { useMemo, useCallback } from "react";
import { signup, login, checkToken } from "../utils/auth";
import { changePassword, deleteAccount } from "../utils/Api";

export default function useAppActions({
  auth,
  items,
  modals,
  navigate,
  seeds,
  getAvatarUrl,
}) {
  const { currentUser, setCurrentUser, setIsLoggedIn, setToken } = auth;
  const {
    allUsersMoods,
    setAllUsersMoods,
    addItem,
    updateItemMoods,
    deleteItem,
    updateProfile,
    getItems,
  } = items;
  const { closeModal, setPendingAvatarUrl } = modals;

  const userMoods = useMemo(() => {
    if (!currentUser || !allUsersMoods) return [];
    return allUsersMoods.flatMap(
      (item) =>
        item.moods
          ?.filter((m) => m.users.includes(currentUser._id))
          .map((m) => m.name) || []
    );
  }, [allUsersMoods, currentUser]);

  // accepts array [] = all, or ["movie", "music"] etc.
  const getUserMoods = useCallback(
    (userId, mediaFilter = []) => {
      if (!allUsersMoods) return [];
      return allUsersMoods
        .filter(
          (item) =>
            mediaFilter.length === 0 || mediaFilter.includes(item.mediaType)
        )
        .flatMap(
          (item) =>
            item.moods
              ?.filter((m) => m.users.includes(userId))
              .map((m) => m.name) || []
        );
    },
    [allUsersMoods]
  );

  const handleProfileSubmit = useCallback(
    (data) => {
      const token = localStorage.getItem("jwt");
      return updateProfile({ ...data }, token)
        .then((updatedUser) => {
          setCurrentUser(updatedUser);
          setPendingAvatarUrl("");
        })
        .catch(console.error);
    },
    [setCurrentUser, setPendingAvatarUrl]
  );

  const handleChangePassword = useCallback(({ currentPassword, newPassword }) => {
    const token = localStorage.getItem("jwt");
    return changePassword({ currentPassword, newPassword }, token);
  }, []);

  const handleDeleteAccount = useCallback(() => {
    const token = localStorage.getItem("jwt");
    return deleteAccount(token).then(() => {
      localStorage.removeItem("jwt");
      auth.setCurrentUser(null);
      auth.setIsLoggedIn(false);
      auth.setToken(null);
      navigate("/");
    });
  }, [auth, navigate]);

  const handleLogIn = useCallback(
    ({ email, password }) => {
      return login({ email, password }).then((res) => {
        localStorage.setItem("jwt", res.token);
        auth.setToken(res.token);
        setIsLoggedIn(true);
        return checkToken(res.token).then((user) => {
          setCurrentUser(user);
          getItems?.(res.token)
            .then((itemsRes) => setAllUsersMoods(itemsRes?.data || []))
            .catch(console.error);
          closeModal();
          navigate("/profile");
        });
      });
    },
    [setIsLoggedIn, setCurrentUser, setAllUsersMoods, closeModal, navigate, getItems]
  );

  const handleSignUp = useCallback(
    ({ name, email, password }) => {
      const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
      const defaultAvatarUrl = getAvatarUrl(randomSeed);
      signup({ name, email, password })
        .then(() =>
          handleLogIn({ email, password }).then(() =>
            handleProfileSubmit({ name, avatarUrl: defaultAvatarUrl })
          )
        )
        .catch(console.error);
    },
    [seeds, getAvatarUrl, handleLogIn, handleProfileSubmit]
  );

  const handleLogOut = useCallback(() => {
    auth.setIsLoggingOut(true);
    navigate("/");
    const interval = setInterval(() => {
      if (items.isLoaded) {
        clearInterval(interval);
        localStorage.removeItem("jwt");
        auth.setCurrentUser(null);
        auth.setIsLoggedIn(false);
        auth.setIsLoggingOut(false);
      }
    }, 10);
  }, [auth, items, navigate]);

  const handleSave = useCallback(
    (updatedItem) => {
      if (!updatedItem) return;
      const token = localStorage.getItem("jwt");
      const existingItem = allUsersMoods.find((i) => i._id === updatedItem._id);

      if (existingItem) {
        const moodsChanged =
          JSON.stringify(existingItem.moods) !== JSON.stringify(updatedItem.moods);
        if (!moodsChanged) return closeModal();

        updateItemMoods(updatedItem._id, updatedItem.moods, token)
          .then((res) => {
            setAllUsersMoods((prev) => [
              res.data,
              ...prev.filter((i) => i._id !== res.data._id),
            ]);
            closeModal();
          })
          .catch(console.error);
      } else {
        const itemToSend = {
          _id: updatedItem._id || updatedItem.id,
          title: updatedItem.title,
          mediaType: updatedItem.mediaType,
          poster: updatedItem.poster || null,
          length: updatedItem.length || null,
          author: updatedItem.author || null,
          moods: updatedItem.moods.map((m) => ({
            name: m.name,
            users: m.users.map((u) => u.toString()),
          })),
        };
        addItem(itemToSend, token)
          .then((res) => {
            setAllUsersMoods((prev) => [res.data, ...prev]);
            closeModal();
          })
          .catch(console.error);
      }
    },
    [allUsersMoods, setAllUsersMoods, closeModal, addItem, updateItemMoods]
  );

  const handleConfirmDelete = useCallback(
    (pendingDeleteId) => {
      if (!pendingDeleteId || !currentUser) return;
      const token = localStorage.getItem("jwt");
      const item = allUsersMoods.find((i) => i._id === pendingDeleteId);
      if (!item) return;

      const updatedMoods = item.moods.map((m) => ({
        ...m,
        users: m.users.filter((u) => u !== currentUser._id),
      }));
      const filteredMoods = updatedMoods.filter((m) => m.users.length > 0);

      if (filteredMoods.length === 0) {
        deleteItem(pendingDeleteId, token)
          .then(() => {
            setAllUsersMoods((prev) => prev.filter((i) => i._id !== pendingDeleteId));
            closeModal();
          })
          .catch(console.error);
      } else {
        updateItemMoods(pendingDeleteId, filteredMoods, token)
          .then((res) => {
            setAllUsersMoods((prev) =>
              prev.map((i) => (i._id === res.data._id ? res.data : i))
            );
            closeModal();
          })
          .catch(console.error);
      }
    },
    [allUsersMoods, currentUser, setAllUsersMoods, closeModal, deleteItem, updateItemMoods]
  );

  return {
    userMoods,
    handleSignUp,
    handleLogIn,
    handleLogOut,
    handleSave,
    handleConfirmDelete,
    handleProfileSubmit,
    getUserMoods,
    handleChangePassword,
    handleDeleteAccount,
  };
}