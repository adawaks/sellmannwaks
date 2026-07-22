import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import NavBar from "./components/NavBar";
// import OsaSection from "./components/OsaSection";
import MapSection from "./components/MapSection";
import ScheduleSection from "./components/ScheduleSection";
import Toastmasters from "./components/Toastmasters";
import Boende from "./components/Boende";
import Fotografering from "./components/Fotografering";
import Barn from "./components/Barn";
import Presenter from "./components/Presenter";
import BilderLink from "./components/BilderLink";
import BilderPage from "./pages/BilderPage";
import ProtectedGalleryRoute from "./components/ProtectedGalleryRoute";

function MainPage() {
  return (
    <>
      {/* <OsaSection /> */}
      <MapSection />
      <ScheduleSection />
      <Toastmasters />
      <Boende />
      <Fotografering />
      <Barn />
      <Presenter />
      <BilderLink />
    </>
  );
}

function Layout() {
  const location = useLocation();

  const hideNavBar = location.pathname === "/bilder";

  return (
    <div className="app-root">
      {!hideNavBar && <NavBar />}

      <main className={hideNavBar ? "no-navbar" : ""}>
        <Routes>
          <Route path="/" element={<MainPage />} />

          <Route
            path="/bilder"
            element={
              <ProtectedGalleryRoute>
                <BilderPage />
              </ProtectedGalleryRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  useEffect(() => {
    let previousScrollPosition = window.pageYOffset;

    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      const currentScrollPosition = window.pageYOffset;

      if (!navbar) {
        return;
      }

      if (previousScrollPosition > currentScrollPosition) {
        navbar.style.transform = "translateY(0)";
      } else {
        navbar.style.transform = "translateY(-100%)";
      }

      previousScrollPosition = currentScrollPosition;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;