import { useState } from "react";
import "./GoDutchCalculator.css";

const GoDutchCalculator = () => {
  const [people, setPeople] = useState([{ name: "Person 1", cost: 0 }]);
  const [results, setResults] = useState<
    { from: string; to: string; amount: string }[]
  >([]);

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const values = [...people];

    if (name === "cost") {
      values[index][name] = value === "" ? 0 : Math.max(0, parseFloat(value));
    } else if (name === "name") {
      values[index][name] = value;
    }

    setPeople(values);
  };

  const handleAddPerson = () => {
    setPeople([...people, { name: `Person ${people.length + 1}`, cost: 0 }]);
  };

  const handleRemovePerson = () => {
    const values = [...people];
    values.pop();
    setPeople(values);
  };

  const calculate = () => {
    const totalCost = people.reduce(
      (sum, person) => sum + (person.cost || 0),
      0
    );
    const share = totalCost / people.length;

    // Determine how much each person owes or is owed
    const differences = people.map((person) => ({
      name: person.name,
      cost: person.cost || 0,
      difference: (person.cost || 0) - share,
    }));

    // Sort the differences into those who owe and those who are owed
    let owes = differences.filter((person) => person.difference < 0);
    let owed = differences.filter((person) => person.difference > 0);

    // Create a list to store the transactions
    let transactions = [];

    // Match those who owe with those who are owed
    while (owes.length && owed.length) {
      let owingPerson = owes[0];
      let owedPerson = owed[0];
      let amount = Math.min(
        Math.abs(owingPerson.difference),
        owedPerson.difference
      );

      transactions.push({
        from: owingPerson.name,
        to: owedPerson.name,
        amount: amount.toFixed(2),
      });

      // Update the differences
      owingPerson.difference += amount;
      owedPerson.difference -= amount;

      // Remove settled people
      if (owingPerson.difference === 0) owes.shift();
      if (owedPerson.difference === 0) owed.shift();
    }
    setResults(transactions);
  };

  return (
    <div className="container">
      <div className="button-group">
        <button onClick={handleAddPerson}>Add Person</button>
        <button onClick={handleRemovePerson}>Remove Last</button>
      </div>
      {people.map((person, index) => (
        <div key={index} className="person-input">
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={person.name}
            onChange={(event) => handleChange(index, event)}
            min="0"
          />
          <input
            type="number"
            name="cost"
            placeholder="Enter total cost"
            value={person.cost}
            onChange={(event) => handleChange(index, event)}
          />
        </div>
      ))}
      <div className="button-group">
        <button onClick={calculate}>Calculate</button>
      </div>
      {results && (
        <div className="results">
          <h3>Results:</h3>
          {results.map(
            (
              result: { from: string; to: string; amount: string },
              index: number
            ) => (
              <span key={index}>
                {result.from} pays {result.to} ${result.amount}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default GoDutchCalculator;
