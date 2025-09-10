import { Routes, Route, useNavigate } from "react-router-dom";

import Layout from "../Layout/Layout";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import TopMoods from "../TopMoods/TopMoods";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import ItemModal from "../ItemModal/ItemModal";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import LogInModal from "../LogInModal/LogInModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import AvatarModal, { seeds, getAvatarUrl } from "../AvatarModal/AvatarModal";

import CurrentUserContext from "../../contexts/CurrentUserContext";
import MoodsContext from "../../contexts/MoodsContext";

import useAuth from "../../hooks/useAuth";
import useItems from "../../hooks/useItems";
import useModal from "../../hooks/useModal";
import useAppActions from "../../hooks/useAppActions";

function App() {
  // ---------------- Domain hooks ----------------
  const auth = useAuth();
  const items = useItems();
  const modals = useModal();
  const navigate = useNavigate();

  // ---------------- Orchestrator ----------------
  const actions = useAppActions({
    auth,
    items,
    modals,
    navigate,
    seeds,
    getAvatarUrl,
  });

  return (
    <MoodsContext.Provider
      value={{
        allUsersMoods: items.allUsersMoods,
        userMoods: actions.userMoods,
      }}
    >
      <CurrentUserContext.Provider value={auth.currentUser}>
        <>
          {/* ---------------- Routes ---------------- */}
          <Routes>
            <Route
              element={
                <Layout
                  onItemClick={(item) =>
                    modals.setSelectedItem(item) || modals.openModal("item")
                  }
                  resetAutocomplete={false} // optional
                  onSignUpClick={() => modals.openModal("register")}
                  onLogInClick={() => modals.openModal("log-in")}
                  isLoggedIn={auth.isLoggedIn}
                />
              }
            >
              <Route
                path="/"
                element={
                  <Main
                    items={items.allUsersMoods}
                    onCardClick={(item) =>
                      modals.setSelectedItem(item) || modals.openModal("item")
                    }
                    allUsersMoods={items.allUsersMoods}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={auth.isLoggedIn}>
                    <Profile
                      items={items.allUsersMoods}
                      onCardClick={(item) =>
                        modals.setSelectedItem(item) || modals.openModal("item")
                      }
                      onDeleteRequest={(id) =>
                        modals.setPendingDeleteId(id) ||
                        modals.openModal("confirmation")
                      }
                      onEditProfile={() => modals.openModal("edit-profile")}
                      onLogOut={actions.handleLogOut}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/top-moods"
                element={
                  <TopMoods
                    onEditProfile={() => modals.openModal("edit-profile")}
                    userMoods={actions.userMoods}
                  />
                }
              />
            </Route>
          </Routes>

          {/* ---------------- Modals ---------------- */}
          <RegisterModal
            isOpen={modals.activeModal === "register"}
            onClose={modals.closeModal}
            onSignUp={actions.handleSignUp}
            onLogInClick={() => modals.openModal("log-in")}
          />

          <LogInModal
            isOpen={modals.activeModal === "log-in"}
            onClose={modals.closeModal}
            onLogIn={actions.handleLogIn}
            onSignUpClick={() => modals.openModal("register")}
          />

          <ItemModal
            item={modals.selectedItem}
            isOpen={modals.activeModal === "item"}
            onClose={modals.closeModal}
            onSave={actions.handleSave}
            onDeleteRequest={(id) =>
              modals.setPendingDeleteId(id) || modals.openModal("confirmation")
            }
            isLoggedIn={auth.isLoggedIn}
            onSignUpClick={() => modals.openModal("register")}
          />

          <ConfirmationModal
            isOpen={modals.activeModal === "confirmation"}
            onClose={modals.closeModal}
            onConfirm={() =>
              actions.handleConfirmDelete(modals.pendingDeleteId)
            }
          />

          <EditProfileModal
            isOpen={modals.activeModal === "edit-profile"}
            onClose={() =>
              modals.setPendingAvatarUrl("") || modals.closeModal()
            }
            onSubmit={actions.handleProfileSubmit}
            onOpenAvatarModal={() => modals.openSubModal("avatar")}
            avatarUrl={
              modals.pendingAvatarUrl || auth.currentUser?.avatarUrl || ""
            }
            isLoggedIn={auth.isLoggedIn}
          />

          <AvatarModal
            isOpen={modals.subModal === "avatar"}
            onClose={modals.closeSubModal}
            isLoggedIn={auth.isLoggedIn}
            onSave={(url) =>
              modals.setPendingAvatarUrl(url) || modals.closeSubModal()
            }
          />
        </>
      </CurrentUserContext.Provider>
    </MoodsContext.Provider>
  );
}

export default App;
