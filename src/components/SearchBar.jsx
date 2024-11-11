import { useState } from "react";
import "./SearchBar.css";

export const SearchBar = ({ setResults, employees }) => {
  const [input, setInput] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchData(input);
    }
  };

  const fetchData = (value) => {
    if (!value) {
      setResults(employees);
      return;
    }
    const results = employees.filter((user) =>
      user.Name.toLowerCase().includes(value.toLowerCase())
    );
    setResults(results);
  };

  const handleChange = (value) => {
    setInput(value);
    if (!value) {
      setResults(employees); 
    } else {
      fetchData(value); 
    }
  };

  return (
    <div className="input-wrapper">
      <input
        className="search-input"
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};
