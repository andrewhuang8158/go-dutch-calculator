import { useState, useMemo } from "react";
import "./TipTaxSplitter.css";

interface Order {
  id: number;
  name: string;
  subtotal: number;
}

const TipTaxSplitter = () => {
  const [data, setData] = useState<Order[]>([
    { id: 1, name: "Person 1", subtotal: 3 },
    { id: 2, name: "Person 2", subtotal: 5 },
  ]);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [tipRate, setTipRate] = useState<number>(0);

  const handleNameChange = (index: number, value: string) => {
    setData((prevData) =>
      prevData.map((order, i) =>
        i === index ? { ...order, name: value } : order
      )
    );
  };

  const handleInputChange = (index: number, value: string) => {
    // Remove leading zeros
    let cleanValue = value.replace(/^0+/, "");

    // If the field is now empty, set it to "0"
    if (cleanValue === "") {
      cleanValue = "0";
    }

    // Parse the cleaned value as a float
    const parsedValue = parseFloat(cleanValue);

    setData((prevData) =>
      prevData.map((order, i) =>
        i === index ? { ...order, subtotal: parsedValue } : order
      )
    );

    return cleanValue;
  };

  const addRow = () => {
    setData((prevData) => [
      ...prevData,
      {
        id: prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 1,
        name: `Person ${prevData.length + 1}`,
        subtotal: 0,
      },
    ]);
  };

  const removeRow = (id: number) => {
    setData(data.filter((order) => order.id !== id));
  };

  const totalSubtotal = useMemo(
    () => data.reduce((total, order) => total + order.subtotal, 0),
    [data]
  );

  const totalTax = useMemo(() => {
    return totalSubtotal ? (totalSubtotal * taxRate) / totalSubtotal : 0;
  }, [taxRate, totalSubtotal]);

  const totalTip = useMemo(() => {
    return totalSubtotal ? (totalSubtotal * tipRate) / totalSubtotal : 0;
  }, [tipRate, totalSubtotal]);

  const totalBill = useMemo(() => {
    return totalSubtotal + totalTax + totalTip;
  }, [totalSubtotal, totalTax, totalTip]);

  return (
    <div>
      <a
        className="law-checker-link"
        href="https://www.law.cornell.edu/wex/table_tax"
        target="_blank"
        rel="noopener noreferrer"
      >
        Look for your local tipping/tax laws!
      </a>
      <p>
        Tired of paying a fat tip when your order was cheaper than that $60
        steak? This has got you covered.
      </p>
      <p>
        This calculator table distributes the tax and tip proportionately to the
        subtotals of the dishes ordered.
      </p>
      <p>
        Simply input the tax amount paid, tip amount paid, and subtotals of all
        dishes ordered and the calculator will do the rest.
      </p>

      <div className="tax-rate-wrapper">
        <label htmlFor="taxRate">Tax Amount ($): </label>
        <input
          id="taxRate"
          type="number"
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value))}
          onFocus={(e) => e.target.select()}
          onBlur={(e) => {
            if (e.target.value.trim() === "") {
              setTaxRate(0);
            }
          }}
        />
      </div>
      <div className="tip-rate-wrapper">
        <label className="tipRate" htmlFor="tipRate">
          Tip Amount ($):{" "}
        </label>
        <input
          id="tipRate"
          type="number"
          value={tipRate}
          onChange={(e) => setTipRate(parseFloat(e.target.value))}
          onFocus={(e) => e.target.select()}
          onBlur={(e) => {
            if (e.target.value.trim() === "") {
              setTipRate(0);
            }
          }}
        />
      </div>

      <table className="tip-tax-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subtotal</th>
            <th>Tax</th>
            <th>Tip</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order, index) => {
            const tax = (order.subtotal / (totalSubtotal || 1)) * taxRate;
            const tip = (order.subtotal / (totalSubtotal || 1)) * tipRate;
            const total = order.subtotal + tax + tip;

            return (
              <tr key={order.id}>
                <td>
                  <button
                    className="remove-row"
                    onClick={() => removeRow(order.id)}
                  >
                    X
                  </button>
                  <input
                    type="text"
                    value={order.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={order.subtotal}
                    onChange={(e) => {
                      const cleanValue = handleInputChange(
                        index,
                        e.target.value
                      );
                      e.target.value = cleanValue; // Update the input field with the cleaned value
                    }}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) =>
                      e.target.value === ""
                        ? handleInputChange(index, "0")
                        : null
                    }
                    key={`subtotal-${index}`}
                  />
                </td>
                <td>{tax.toFixed(2)}</td>
                <td>{tip.toFixed(2)}</td>
                <td>{total.toFixed(2)}</td>
              </tr>
            );
          })}
          <tr className="total">
            <td>Total</td>
            <td>{totalSubtotal.toFixed(2)}</td>
            <td>{totalTax.toFixed(2)}</td>
            <td>{totalTip.toFixed(2)}</td>
            <td>{totalBill.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <button className="add-row" onClick={addRow}>
        Add Row
      </button>
    </div>
  );
};

export default TipTaxSplitter;
