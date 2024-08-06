import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import GoDutchCalculator from "./component/GoDutchCalculator";
import TipTaxSplitter from "./component/TipTaxSplitter";

const App: React.FC = () => {
  const [taxRate, setTaxRate] = useState<number>(7.5);
  const [tipRate, setTipRate] = useState<number>(15);

  return (
    <Router>
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/">
              <img
                className="home-icon"
                src="home-page-white-icon.jpg"
                alt="home"
              ></img>
            </Link>
          </li>
          <div className="calculators-wrapper">
            <li className="nav-item">
              <Link to="/tip-tax">Tip Tax Table</Link>
            </li>
            <li className="nav-item">
              <Link to="/go-dutch">Go Dutch Calculator</Link>
            </li>
          </div>
        </ul>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <div className="home">
              <h1>Welcome to the Go-Dutch App</h1>
              <a
                href="https://google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Look for your local tipping/tax laws!
              </a>
            </div>
          }
        />
        <Route
          path="/tip-tax"
          element={
            <div className="App">
              <h1>Tip Tax Splitter</h1>
              <div>
                <label htmlFor="taxRate">Tax Amount ($): </label>
                <input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="tipRate">Tip Amount ($): </label>
                <input
                  id="tipRate"
                  type="number"
                  value={tipRate}
                  onChange={(e) => setTipRate(parseFloat(e.target.value))}
                />
              </div>
              <TipTaxSplitter taxRate={taxRate} tipRate={tipRate} />
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
