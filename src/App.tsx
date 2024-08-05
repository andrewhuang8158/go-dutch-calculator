import { useEffect, useState } from "react";
import "./App.css";
import TipTaxTable from "./component/TipTaxTable";
import GoDutchCalculator from "./component/GoDutchTable";

const App: React.FC = () => {
  const [taxRate, setTaxRate] = useState<number>(7.5);
  const [tipRate, setTipRate] = useState<number>(15);

  return (
    <>
      <a href="https://google.com" target="_blank" rel="noopener noreferrer">
        Look for your local tipping/tax laws!
      </a>
      <div className="App">
        <h1>Go-Dutch Calculator</h1>
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
        <TipTaxTable taxRate={taxRate} tipRate={tipRate} />
        <GoDutchCalculator />
      </div>
    </>
  );
};

export default App;
