import { Navigate, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Layout from "../Layout/Layout";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import TopMoods from "../TopMoods/TopMoods";
import WiliAi from "../WiliAi/WiliAi";
import Support from "../Support/Support";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import ProfileShell from "../ProfileShell/ProfileShell";

import ItemModal from "../ItemModal/ItemModal";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import LogInModal from "../LogInModal/LogInModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import AvatarModal, { seeds, getAvatarUrl } from "../AvatarModal/AvatarModal";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import CurrentUserContext from "../../contexts/CurrentUserContext";
import MoodsContext from "../../contexts/MoodsContext";

import useAuth from "../../hooks/useAuth";
import useItems from "../../hooks/useItems";
import useModal from "../../hooks/useModal";
import useAppActions from "../../hooks/useAppActions";

function App() {
  const auth = useAuth();
  const items = useItems();
  const modals = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const actions = useAppActions({
    auth,
    items,
    modals,
    navigate,
    seeds,
    getAvatarUrl,
  });

  const isAppLoaded = auth.isLoaded && items.isLoaded;

  if (!isAppLoaded || auth.isLoggingOut) {
    return <LoadingSpinner />;
  }

  return (
    <MoodsContext.Provider
      value={{
        allUsersMoods: items.allUsersMoods,
        userMoods: actions.userMoods,
      }}
    >
      <CurrentUserContext.Provider value={auth.currentUser}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              element={
                <Layout
                  onItemClick={(item) =>
                    modals.setSelectedItem(item) || modals.openModal("item")
                  }
                  resetAutocomplete={false}
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
                    latestItems={items.latestItems}
                    onCardClick={(item) =>
                      modals.setSelectedItem(item) || modals.openModal("item")
                    }
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={auth.isLoggedIn}>
                    <ProfileShell
                      onEditProfile={() => modals.openModal("edit-profile")}
                      onLogOut={actions.handleLogOut}
                    />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <Profile
                      items={items.allUsersMoods}
                      onCardClick={(item) =>
                        modals.setSelectedItem(item) || modals.openModal("item")
                      }
                      onDeleteRequest={(id) =>
                        modals.setPendingDeleteId(id) ||
                        modals.openModal("confirmation")
                      }
                    />
                  }
                />
                <Route path="top-moods" element={<TopMoods actions={actions} />} />
                <Route
                  path="wili-ai"
                  element={<WiliAi items={items.allUsersMoods} />}
                />
              </Route>
              <Route
                path="/profile/:userId"
                element={<ProfileShell />}
              >
                <Route
                  index
                  element={
                    <Profile
                      items={items.allUsersMoods}
                      onCardClick={(item) =>
                        modals.setSelectedItem(item) || modals.openModal("item")
                      }
                    />
                  }
                />
                <Route path="top-moods" element={<TopMoods actions={actions} />} />
                <Route
                  path="wili-ai"
                  element={<WiliAi items={items.allUsersMoods} />}
                />
              </Route>
              <Route path="/top-moods/:userId?" element={<Navigate to="/profile" replace />} />
              <Route path="/wili-ai/:userId?" element={<Navigate to="/profile" replace />} />
              <Route path="/support" element={<Support />} />
            </Route>
          </Routes>
        </AnimatePresence>

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
          onConfirm={() => actions.handleConfirmDelete(modals.pendingDeleteId)}
        />
        <EditProfileModal
          isOpen={modals.activeModal === "edit-profile"}
          onClose={() => modals.setPendingAvatarUrl("") || modals.closeModal()}
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
      </CurrentUserContext.Provider>
    </MoodsContext.Provider>
  );
}

export default App;
