import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Layout.css";

const containerVariants = {
  hidden: { opacity: 0, y: -25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0, y: 10, transition: { duration: 0.3, ease: "easeIn" } },
};

function Layout({
  onItemClick,
  resetAutocomplete,
  onSignUpClick,
  onLogInClick,
  isLoggedIn,
}) {
  const location = useLocation();

  return (
    <motion.div
      className="app"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="app__content">
        <Header
          onItemClick={onItemClick}
          resetAutocomplete={resetAutocomplete}
          onSignUpClick={onSignUpClick}
          onLogInClick={onLogInClick}
          isLoggedIn={isLoggedIn}
        />
        <Outlet />
        <Footer />
      </div>
    </motion.div>
  );
}

export default Layout;
