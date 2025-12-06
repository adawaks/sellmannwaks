import React, { useEffect } from "react";
import NavBar from "./components/NavBar";
import OsaSection from "./components/OsaSection";
import MapSection from "./components/MapSection";
import ScheduleSection from "./components/ScheduleSection";
import Toastmasters from "./components/Toastmasters";
import Boende from "./components/Boende";
import Fotografering from "./components/Fotografering";
import Barn from "./components/Barn";
import Presenter from "./components/Presenter";
import Modal from './components/Modal/Modal'

function App() {
  // auto-hide navbar on scroll (same behavior as Streamlit JS)
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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app-root">
      <a id="top" />
      <NavBar />
      <main>
        <OsaSection />
        <MapSection />
        <ScheduleSection />
        <Toastmasters />
        <Boende />
        <Fotografering />
        <Barn />
        <Presenter />
      </main>
    </div>
  );
}

export default App;
