import { useMemo, useCallback } from "react";
import { signup, login, checkToken } from "../utils/auth";

/*
  useAppActions is a custom hook (uses useMemo and useCallback internally)
  It orchestrates workflows across multiple domain hooks: auth, items, modals.
*/
export default function useAppActions({
  auth, // object destructuring: auth hook object
  items, // object destructuring: items hook object
  modals, // object destructuring: modal hook object
  navigate, // navigation function from react-router
  seeds, // avatar seeds array
  getAvatarUrl, // function to get avatar URL from seed
}) {
  // --------- Destructuring auth object ---------
  const { currentUser, setCurrentUser, setIsLoggedIn } = auth;

  // --------- Destructuring items object ---------
  const {
    allUsersMoods,
    setAllUsersMoods,
    addItem,
    updateItemMoods,
    deleteItem,
    updateProfile,
    getItems, // added to use directly
  } = items;

  // --------- Destructuring modals object ---------
  const { closeModal, setPendingAvatarUrl } = modals;

  // ---------- Derived state ----------
  const userMoods = useMemo(() => {
    if (!currentUser || !allUsersMoods) return [];
    return allUsersMoods.flatMap(
      (item) =>
        item.moods
          ?.filter((m) => m.users.includes(currentUser._id))
          .map((m) => m.name) || []
    );
  }, [allUsersMoods, currentUser]); // dependency array for useMemo

  // ---------- New function: get any user's moods ----------
  const getUserMoods = useCallback(
    (userId) => {
      if (!allUsersMoods) return [];
      return allUsersMoods.flatMap(
        (item) =>
          item.moods
            ?.filter((m) => m.users.includes(userId))
            .map((m) => m.name) || []
      );
    },
    [allUsersMoods]
  );

  // ---------- Profile workflows ----------
  const handleProfileSubmit = useCallback(
    (data) => {
      const token = localStorage.getItem("jwt");
      const payload = { ...data };

      updateProfile(payload, token)
        .then((updatedUser) => {
          setCurrentUser(updatedUser);
          setPendingAvatarUrl("");
          closeModal();
        })
        .catch(console.error);
    },
    [setCurrentUser, closeModal] // dependency array for useCallback
  );

  // ---------- Auth + Modal workflows ----------
  const handleLogIn = useCallback(
    ({ email, password }) => {
      return login({ email, password }).then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);

        return checkToken(res.token).then((user) => {
          setCurrentUser(user);

          // --- Fetch items immediately after login ---
          getItems?.(res.token)
            .then((itemsRes) => {
              setAllUsersMoods(itemsRes?.data || []);
            })
            .catch(console.error);

          closeModal();
          navigate("/profile");
        });
      });
    },
    [
      setIsLoggedIn,
      setCurrentUser,
      setAllUsersMoods,
      closeModal,
      navigate,
      getItems,
    ]
  );

  const handleSignUp = useCallback(
    ({ name, email, password }) => {
      const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
      const defaultAvatarUrl = getAvatarUrl(randomSeed);

      signup({ name, email, password })
        .then(() =>
          handleLogIn({ email, password }).then(() => {
            return handleProfileSubmit({ name, avatarUrl: defaultAvatarUrl });
          })
        )
        .catch(console.error);
    },
    [seeds, getAvatarUrl, handleLogIn, handleProfileSubmit]
  );

  const handleLogOut = useCallback(() => {
    auth.setIsLoggingOut(true); // show spinner immediately
    navigate("/"); // route change starts

    // check periodically until items finish loading, then clear auth
    const interval = setInterval(() => {
      if (items.isLoaded) {
        clearInterval(interval);

        localStorage.removeItem("jwt");
        auth.setCurrentUser(null);
        auth.setIsLoggedIn(false);
        auth.setIsLoggingOut(false);
      }
    }, 10); // small interval
  }, [auth, items, navigate]);

  // ---------- Items workflows ----------
  const handleSave = useCallback(
    (updatedItem) => {
      if (!updatedItem) return;
      const token = localStorage.getItem("jwt");

      const existingItem = allUsersMoods.find((i) => i._id === updatedItem._id);

      if (existingItem) {
        const moodsChanged =
          JSON.stringify(existingItem.moods) !==
          JSON.stringify(updatedItem.moods);
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
          poster: updatedItem.poster,
          length: updatedItem.length,
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
            setAllUsersMoods((prev) =>
              prev.filter((i) => i._id !== pendingDeleteId)
            );
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
    [
      allUsersMoods,
      currentUser,
      setAllUsersMoods,
      closeModal,
      deleteItem,
      updateItemMoods,
    ]
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
  };
}
