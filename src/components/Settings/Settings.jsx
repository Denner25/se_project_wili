import "./Settings.css";
import { useContext, useEffect, useState } from "react";
import useFormValidator from "../../hooks/useFormValidator";
import AvatarModal from "../AvatarModal/AvatarModal";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Settings({ actions, modals, avatarUrl, onOpenAvatarModal }) {
  const { user: currentUser } = useContext(CurrentUserContext);

  // ---------- Profile form ----------
  const profileForm = useFormValidator({ name: "", avatarUrl: "" });
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // ---------- Password form ----------
  const passwordForm = useFormValidator({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ---------- Delete form ----------
  const [deleteChecked, setDeleteChecked] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Pre-fill profile form with current user's name when loaded
  useEffect(() => {
    if (currentUser) {
      profileForm.resetForm({ name: currentUser.name || "" });
    }
    // Only run when currentUser first loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // ---------- Handlers ----------
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");
    actions
      .handleProfileSubmit({ ...profileForm.values, avatarUrl })
      .then(() => setProfileSuccess("Profile updated successfully."))
      .catch(() => setProfileError("Something went wrong. Please try again."));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (passwordForm.values.newPassword !== passwordForm.values.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    actions
      .handleChangePassword({
        currentPassword: passwordForm.values.currentPassword,
        newPassword: passwordForm.values.newPassword,
      })
      .then(() => {
        setPasswordSuccess("Password updated successfully.");
        passwordForm.resetForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((err) => {
        setPasswordError(
          err?.message || "Something went wrong. Please try again."
        );
      });
  };

  const handleDeleteSubmit = (e) => {
    e.preventDefault();
    setDeleteError("");

    if (!deleteChecked) {
      setDeleteError("Please confirm by checking the box.");
      return;
    }

    actions.handleDeleteAccount().catch(() => {
      setDeleteError("Something went wrong. Please try again.");
    });
  };

  return (
    <div className="settings">

      {/* -------- Profile section -------- */}
      <section className="settings__section">
        <h2 className="settings__title">Settings</h2>
        <form className="settings__form" onSubmit={handleProfileSubmit}>

          {/* Avatar */}
          <div className="settings__avatar-row">
            <span className="settings__label">Avatar</span>
            <img
              src={avatarUrl}
              alt="Current avatar"
              className="settings__avatar-img"
            />
            <button
              type="button"
              className="settings__avatar-edit"
              onClick={onOpenAvatarModal}
              aria-label="Change avatar"
            >
            {/* Pencil SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>  
            </button>
          </div>

          <label className="settings__label">
            Name
            <input
              type="text"
              name="name"
              className="settings__input"
              placeholder="Enter your name"
              required
              minLength={2}
              maxLength={30}
              value={profileForm.values.name ?? ""}
              onChange={profileForm.handleChange}
            />
            {profileForm.errors.name && (
              <span className="settings__error">{profileForm.errors.name}</span>
            )}
          </label>

          {profileSuccess && <p className="settings__success">{profileSuccess}</p>}
          {profileError && <p className="settings__error">{profileError}</p>}

          <button
            type="submit"
            className="settings__button"
            disabled={!profileForm.isValid}
          >
            Save changes
          </button>
        </form>
      </section>

      <div className="settings__divider" />

      {/* -------- Change password section -------- */}
      <section className="settings__section">
        <h2 className="settings__title">Change Password</h2>
        <form className="settings__form" onSubmit={handlePasswordSubmit}>

          <label className="settings__label">
            Current password
            <input
              type="password"
              name="currentPassword"
              className="settings__input"
              placeholder="Enter current password"
              required
              value={passwordForm.values.currentPassword ?? ""}
              onChange={passwordForm.handleChange}
            />
            {passwordForm.errors.currentPassword && (
              <span className="settings__error">{passwordForm.errors.currentPassword}</span>
            )}
          </label>

          <label className="settings__label">
            New password
            <input
              type="password"
              name="newPassword"
              className="settings__input"
              placeholder="At least 8 characters"
              required
              minLength={8}
              value={passwordForm.values.newPassword ?? ""}
              onChange={passwordForm.handleChange}
            />
            {passwordForm.errors.newPassword && (
              <span className="settings__error">{passwordForm.errors.newPassword}</span>
            )}
          </label>

          <label className="settings__label">
            Confirm new password
            <input
              type="password"
              name="confirmPassword"
              className="settings__input"
              placeholder="Repeat new password"
              required
              minLength={8}
              value={passwordForm.values.confirmPassword ?? ""}
              onChange={passwordForm.handleChange}
            />
          </label>

          {passwordSuccess && <p className="settings__success">{passwordSuccess}</p>}
          {passwordError && <p className="settings__error">{passwordError}</p>}

          <button
            type="submit"
            className="settings__button"
            disabled={!passwordForm.isValid}
          >
            Update password
          </button>
        </form>
      </section>

      <div className="settings__divider" />

      {/* -------- Delete account section -------- */}
      <section className="settings__section settings__section--danger">
        <h2 className="settings__title settings__title--danger">Delete Account</h2>
        <p className="settings__warning">
          This will permanently delete your account and all your mood data. This cannot be undone.
        </p>
        <form className="settings__form" onSubmit={handleDeleteSubmit}>

          <label className="settings__checkbox-label">
            <input
              type="checkbox"
              checked={deleteChecked}
              onChange={(e) => setDeleteChecked(e.target.checked)}
            />
            I understand this action is permanent and cannot be undone
          </label>

          {deleteError && <p className="settings__error">{deleteError}</p>}

          <button
            type="submit"
            className="settings__button settings__button--danger"
            disabled={!deleteChecked}
          >
            Delete my account
          </button>
        </form>
      </section>

    </div>
  );
}

export default Settings;