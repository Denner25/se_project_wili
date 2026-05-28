import { useMemo, useCallback } from "react";
import { signup, login, checkToken } from "../utils/auth";
import {
  changePassword,
  deleteAccount,
  updateProfile,
  updatePrivateItems,
  updateCollectionPrivacy,
  getItems,
  getUserItems,
} from "../utils/Api";

export default function useAppActions({
  auth,
  items,
  modals,
  navigate,
  seeds,
  getAvatarUrl,
}) {
  const { currentUser, setCurrentUser, setIsLoggedIn } = auth;
  const {
    allUsersMoods,
    setAllUsersMoods,
    ownerItems,
    setOwnerItems,
    addItem,
    updateItemMoods,
    deleteItem,
  } = items;
  const { closeModal, setPendingAvatarUrl } = modals;

  const userMoods = useMemo(() => {
    if (!currentUser || !ownerItems) return [];
    return ownerItems.flatMap(
      (item) =>
        item.moods
          ?.filter((m) => m.users.includes(currentUser._id))
          .map((m) => m.name) || []
    );
  }, [ownerItems, currentUser]);

  const getUserMoods = useCallback(
    (userId, mediaFilter = []) => {
      if (!ownerItems) return [];
      return ownerItems
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
    [ownerItems]
  );

  const refreshAllItems = useCallback(() => {
    const token = localStorage.getItem("jwt");
    const sort = (data) =>
      (data || []).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    getItems()
      .then((res) => setAllUsersMoods(sort(res.data)))
      .catch(console.error);

    if (token) {
      getUserItems(token)
        .then((res) => setOwnerItems(sort(res.data)))
        .catch(console.error);
    }
  }, [setAllUsersMoods, setOwnerItems]);

  const handleProfileSubmit = useCallback(
    (data) => {
      const token = localStorage.getItem("jwt");
      return updateProfile(data, token)
        .then((updatedUser) => {
          setCurrentUser(updatedUser);
          setPendingAvatarUrl("");
        })
        .catch(console.error);
    },
    [setCurrentUser, setPendingAvatarUrl]
  );

  const handlePrivacyUpdate = useCallback(
    ({ collectionPrivate }) => {
      setCurrentUser((prev) => ({ ...prev, collectionPrivate }));
      const token = localStorage.getItem("jwt");
      return updateCollectionPrivacy({ collectionPrivate }, token)
        .then((updatedUser) => {
          setCurrentUser(updatedUser);
          getItems()
            .then((res) =>
              setAllUsersMoods(
                res.data.sort(
                  (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                )
              )
            )
            .catch(console.error);
        })
        .catch((err) => {
          setCurrentUser((prev) => ({
            ...prev,
            collectionPrivate: !collectionPrivate,
          }));
          return Promise.reject(err);
        });
    },
    [setCurrentUser, setAllUsersMoods]
  );

  const handlePrivacyChange = useCallback(
    (itemId, isPrivate) => {
      const id = String(itemId);

      // Optimistic update — normalize all ids to strings
      setCurrentUser((prev) => {
        const current = (prev.privateItems || []).map(String);
        const updated = isPrivate
          ? [...new Set([...current, id])]
          : current.filter((i) => i !== id);
        return { ...prev, privateItems: updated };
      });

      const token = localStorage.getItem("jwt");
      return updatePrivateItems({ itemId, isPrivate }, token)
        .then((updatedUser) => {
          // Normalize server response to strings too
          setCurrentUser({
            ...updatedUser,
            privateItems: (updatedUser.privateItems || []).map(String),
          });
          getItems()
            .then((res) =>
              setAllUsersMoods(
                res.data.sort(
                  (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                )
              )
            )
            .catch(console.error);
        })
        .catch((err) => {
          // Roll back — normalize here too
          setCurrentUser((prev) => {
            const current = (prev.privateItems || []).map(String);
            const rolled = isPrivate
              ? current.filter((i) => i !== id)
              : [...new Set([...current, id])];
            return { ...prev, privateItems: rolled };
          });
          return Promise.reject(err);
        });
    },
    [setCurrentUser, setAllUsersMoods]
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
          setCurrentUser({
            ...user,
            privateItems: (user.privateItems || []).map(String),
          });
          const sort = (data) =>
            (data || []).sort(
              (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );
          getItems()
            .then((itemsRes) => setAllUsersMoods(sort(itemsRes?.data)))
            .catch(console.error);
          getUserItems(res.token)
            .then((itemsRes) => setOwnerItems(sort(itemsRes?.data)))
            .catch(console.error);
          closeModal();
          navigate("/profile");
        });
      });
    },
    [setIsLoggedIn, setCurrentUser, setAllUsersMoods, setOwnerItems, closeModal, navigate]
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
      const existingItem = ownerItems.find((i) => i._id === updatedItem._id);

      if (existingItem) {
        const moodsChanged =
          JSON.stringify(existingItem.moods) !== JSON.stringify(updatedItem.moods);
        if (!moodsChanged) return closeModal();

        updateItemMoods(updatedItem._id, updatedItem.moods, token)
          .then((res) => {
            setOwnerItems((prev) => [
              res.data,
              ...prev.filter((i) => i._id !== res.data._id),
            ]);
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
    setOwnerItems((prev) => [res.data, ...prev]);
    // Don't add to public feed if user has collection privacy on —
    // their moods shouldn't be the reason an item appears on main
    if (!currentUser?.collectionPrivate) {
      setAllUsersMoods((prev) => {
        const exists = prev.some((i) => i._id === res.data._id);
        return exists
          ? prev.map((i) => (i._id === res.data._id ? res.data : i))
          : [res.data, ...prev];
      });
    }
    closeModal();
  })
  .catch(console.error);
      }
    },
    [ownerItems, setOwnerItems, setAllUsersMoods, closeModal, addItem, updateItemMoods]
  );

  const handleConfirmDelete = useCallback(
    (pendingDeleteId) => {
      if (!pendingDeleteId || !currentUser) return;
      const token = localStorage.getItem("jwt");
      const item = ownerItems.find((i) => i._id === pendingDeleteId);
      if (!item) return;

      const updatedMoods = item.moods.map((m) => ({
        ...m,
        users: m.users.filter((u) => u !== currentUser._id),
      }));
      const filteredMoods = updatedMoods.filter((m) => m.users.length > 0);

      if (filteredMoods.length === 0) {
        deleteItem(pendingDeleteId, token)
          .then(() => {
            setOwnerItems((prev) => prev.filter((i) => i._id !== pendingDeleteId));
            setAllUsersMoods((prev) => prev.filter((i) => i._id !== pendingDeleteId));
            closeModal();
          })
          .catch(console.error);
      } else {
        updateItemMoods(pendingDeleteId, filteredMoods, token)
          .then((res) => {
            setOwnerItems((prev) =>
              prev.map((i) => (i._id === res.data._id ? res.data : i))
            );
            setAllUsersMoods((prev) =>
              prev.map((i) => (i._id === res.data._id ? res.data : i))
            );
            closeModal();
          })
          .catch(console.error);
      }
    },
    [ownerItems, currentUser, setOwnerItems, setAllUsersMoods, closeModal, deleteItem, updateItemMoods]
  );

  return {
    userMoods,
    handleSignUp,
    handleLogIn,
    handleLogOut,
    handleSave,
    handleConfirmDelete,
    handleProfileSubmit,
    handlePrivacyUpdate,
    handlePrivacyChange,
    getUserMoods,
    handleChangePassword,
    handleDeleteAccount,
    refreshAllItems,
  };
}