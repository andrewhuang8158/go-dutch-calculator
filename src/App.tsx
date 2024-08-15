import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import GoDutchCalculator from "./component/GoDutchCalculator";
import TipTaxSplitter from "./component/TipTaxSplitter";

const App: React.FC = () => {
  const [showHamburger, setShowHamburger] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  const checkNavbarHeight = () => {
    if (navbarRef.current) {
      const navbarHeight = navbarRef.current.clientHeight;
      setShowHamburger(navbarHeight > 84);
    }
  };

  useEffect(() => {
    checkNavbarHeight();
    window.addEventListener("resize", checkNavbarHeight);
    return () => window.removeEventListener("resize", checkNavbarHeight);
  }, []);

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="home-link">
          <h3 className="home-text">Andrew's Calculators and Tools</h3>
        </Link>
        {showHamburger ? (
          <button className="hamburger visible">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
            >
              <path
                stroke="rgba(255, 255, 255, 0.5)"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M4 7h22M4 15h22M4 23h22"
              />
            </svg>
          </button>
        ) : (
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/tip-tax">Tip Tax Table</Link>
            </li>
            <li className="nav-item">
              <Link to="/go-dutch">Go Dutch Calculator</Link>
            </li>
            <li className="nav-item">
              <Link to="/go-dutch">Go Dutch Calculator</Link>
            </li>
          </ul>
        )}
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <div className="home">
              <h1>Welcome to the Go-Dutch App</h1>
              <p>
                This is just a random project where I can throw a whole bunch of
                random stuff together
              </p>
              <p>As of right now I've made two calculators. </p>
              <p>
                1. go-dutch calculator in which users can more simply figure out
                who pays who what when splitting a get together like a potluck
                or cookout
              </p>
              <p>
                2. Tip Tax splitter which does a similar task but instead splits
                the tip and tax amount based on the subtotal's of the dishes
                ordered.{" "}
              </p>
            </div>
          }
        />
        <Route
          path="/tip-tax"
          element={
            <div className="App">
              <h1>Tip Tax Splitter</h1>

              <TipTaxSplitter />
            </div>
          }
        />
        <Route
          path="/go-dutch"
          element={
            <div className="App">
              <h1>Go-Dutch Calculator</h1>
              <GoDutchCalculator />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
