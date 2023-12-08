// App.js
import React, { useState } from 'react';
import './App.css'; // Import your CSS for styling

const App = () => {
  const [budget, setBudget] = useState(1000);
  const [spentSoFar, setSpentSoFar] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(budget - spentSoFar);
  const [allocation, setAllocation] = useState(0);
  const [currency, setCurrency] = useState('$');

  const handleAllocationChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.trim() === "") {
      // Handle empty input (optional)
      setAllocation(0);
      alert("Allocation cannot be empty. Set to 0.");
    } else {
      const newAllocation = parseFloat(inputValue);
      if (!isNaN(newAllocation)) {
        if (newAllocation > budget) {
          // Display an alert for exceeding the budget
          alert(`Cannot allocate ${newAllocation} as actual budget is ${budget}.`);
        } else {
          setAllocation(newAllocation);
        }
      } else {
        // Handle non-numeric input
        alert("Please enter a valid numeric value.");
      }
    }
  };

  const handleBudgetChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.trim() === "") {
      // Handle empty input (optional)
      setBudget(0);
      alert("Budget cannot be empty. Set to 0.");
    } else {
      const newBudget = parseFloat(inputValue);
      if (!isNaN(newBudget)) {
        if (newBudget > 20000) {
          // Display an alert for exceeding the maximum budget
          alert("Budget cannot be more than 20000.");
        } else if (newBudget >= spentSoFar) {
          setBudget(newBudget);
          setRemainingBudget(newBudget - spentSoFar); // Update remainingBudget
        } else {
          // Display an alert for invalid budget (less than spentSoFar)
          alert("Budget cannot be less than spent so far.");
        }
      } else {
        // Handle non-numeric input
        alert("Please enter a valid numeric value for the budget.");
      }
    }
  };
  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    // Update other representations based on the selected currency
    setRemainingBudget(budget - spentSoFar);
    setAllocation(allocation);
    // ... (update Spent so far, Allocated Budget, Change Allocation)
  };

  const handleDecrease = () => {
    const newAllocation = parseFloat(allocation) - 10;
    if (!isNaN(newAllocation) && newAllocation >= spentSoFar && newAllocation <= budget) {
      setAllocation(newAllocation);
      setRemainingBudget(budget - newAllocation); // Update remainingBudget
    }
  };

  const handleIncrease = () => {
    const newAllocation = parseFloat(allocation) + 10;
    if (!isNaN(newAllocation) && newAllocation >= spentSoFar && newAllocation <= budget) {
      setAllocation(newAllocation);
      setRemainingBudget(budget - newAllocation); // Update remainingBudget
    }
  };

  const handleSpentSoFarChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.trim() === "") {
      // Handle empty input (optional)
      setSpentSoFar(0);
      alert("Spent so far cannot be empty. Set to 0.");
    } else {
      const newSpentSoFar = parseFloat(inputValue);
      if (!isNaN(newSpentSoFar)) {
        if (newSpentSoFar <= budget) {
          setSpentSoFar(newSpentSoFar);
          setRemainingBudget(budget - newSpentSoFar); // Update remainingBudget
        } else {
          // Display an alert for exceeding the budget
          alert("Spent so far cannot be more than the budget.");
        }
      } else {
        // Handle non-numeric input
        alert("Please enter a valid numeric value for spent so far.");
      }
    }
  };

  return (
    <div className="App">
      <div className="label-input-container">
        <label>Budget:</label>
        <button onClick={handleDecrease} className="styled-button">-</button>
        {currency}
        <input
          type="number"
          value={budget}
          onChange={handleBudgetChange}
          min={spentSoFar}
          max={20000}
        />
        <button onClick={handleIncrease} className="styled-button">+</button>
      </div>
      <div className="label-input-container">
        <label>Remaining:</label> 
        {currency}
        {remainingBudget}
      </div>
      <div className="label-input-container">
        <label>Spent so far:</label>
        
        {currency}
        <input
          type="number"
          value={spentSoFar}
          onChange={handleSpentSoFarChange}
          min={0}
          max={budget}
        />
      </div>
      <div className="label-input-container">
        <label>Allocation:</label>
        {currency}
        <input
          type="number"
          value={allocation}
          onChange={handleAllocationChange}
        />
      </div>
      <div className="label-input-container">
        <label>Currency:</label>
        <CurrencyDropdown
          selectedCurrency={currency}
          options={['$ Dollar', '£ Pound', '€ Euro', '₹ Ruppee']}
          onChange={handleCurrencyChange}
        />
      </div>
      <div className="button-container">
        <label>Decrease/Increase Buttons:</label>
        <button onClick={handleDecrease} className="styled-button">-</button>
        <button onClick={handleIncrease} className="styled-button">+</button>
      </div>
    </div>
  );
};

const EditableNumberField = ({ value, onValueChange, minValue, maxValue, prefix }) => {
  const handleDecrease = () => {
    onValueChange(value - 10);
  };

  const handleIncrease = () => {
    onValueChange(value + 10);
  };

  return (
    <div>
      <button onClick={handleDecrease} className="styled-button">-</button>
      <input
        type="text"
        value={`${prefix} ${value}`}
        onChange={(e) => onValueChange(parseFloat(e.target.value))}
      />
      <button onClick={handleIncrease} className="styled-button">+</button>
    </div>
  );
};

const CurrencyDropdown = ({ label, selectedCurrency, options, onChange }) => {
  return (
    <div>
      <label>{label}:</label>
      <select value={selectedCurrency} onChange={(e) => onChange(e.target.value)} className="styled-dropdown">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default App;