import React, { useState } from 'react';

const GoDutchCalculator = () => {
  const [totalBill, setTotalBill] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [tipPercentage, setTipPercentage] = useState('');
  const [perPerson, setPerPerson] = useState(null);

  const calculatePerPerson = () => {
    if (!totalBill || !numPeople || !tipPercentage) {
      alert("Please fill in all fields.");
      return;
    }
    const bill = parseFloat(totalBill);
    const people = parseInt(numPeople);
    const tip = parseFloat(tipPercentage);

    if (isNaN(bill) || isNaN(people) || isNaN(tip)) {
      alert("Please enter valid numbers.");
      return;
    }

    const totalWithTip = bill + (bill * (tip / 100));
    const amountPerPerson = totalWithTip / people;

    setPerPerson(amountPerPerson.toFixed(2));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>Go Dutch Calculator</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Total Bill Amount: </label>
        <input
          type="number"
          value={totalBill}
          onChange={(e) => setTotalBill(e.target.value)}
          placeholder="Enter total bill"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Number of People: </label>
        <input
          type="number"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
          placeholder="Enter number of people"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Tip Percentage: </label>
        <input
          type="number"
          value={tipPercentage}
          onChange={(e) => setTipPercentage(e.target.value)}
          placeholder="Enter tip percentage"
        />
      </div>
      <button onClick={calculatePerPerson}>Calculate</button>
      {perPerson && (
        <div style={{ marginTop: '20px' }}>
          <h3>Amount Per Person: ${perPerson}</h3>
        </div>
      )}
    </div>
  );
};

export default GoDutchCalculator;