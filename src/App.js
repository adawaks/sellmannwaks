import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar";
//import OsaSection from "./components/OsaSection";
import MapSection from "./components/MapSection";
import ScheduleSection from "./components/ScheduleSection";
import Toastmasters from "./components/Toastmasters";
import Boende from "./components/Boende";
import Fotografering from "./components/Fotografering";
import Barn from "./components/Barn";
import Presenter from "./components/Presenter";
import BilderLink from "./components/BilderLink";
import BilderPage from "./pages/BilderPage";


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

          <Route
            path="/"
            element={<MainPage />}
          />

          <Route
            path="/bilder"
            element={<BilderPage />}
          />

        </Routes>

      </main>

    </div>
  );
}

function App() {

  useEffect(() => {
    let prevScrollpos = window.pageYOffset;
    const navbar = document.getElementById("navbar");

    const onScroll = () => {
      const currentScrollPos = window.pageYOffset;

      if (!navbar) return;

      if (prevScrollpos > currentScrollPos) {
        navbar.style.transform = "translateY(0)";
      } else {
        navbar.style.transform = "translateY(-100%)";
      }

      prevScrollpos = currentScrollPos;
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };

  }, []);


  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}


export default App;