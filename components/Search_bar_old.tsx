"use client"
import React, { useState } from 'react'

const Search_bar = ({ show_map_btn, onSearch, onSuggestionsFetch }) => {
  const [input, setInput] = useState('') // Manage input state
  const [suggestions, setSuggestions] = useState([]) // Manage suggestions state

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (onSearch) {
      onSearch(input); // Pass the input value to the parent function
    }
    setSuggestions([]); // Clear suggestions after search
  }

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value); // Update input value
    if (onSuggestionsFetch && value.trim()) {
      onSuggestionsFetch(value)
        .then((fetchedSuggestions) => {
          console.log("Fetched Suggestions:", fetchedSuggestions);
          setSuggestions(fetchedSuggestions); // Update suggestions state
        })
        .catch((err) => console.error("Failed to fetch suggestions:", err));
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.label); // Update input with the selected suggestion
    setSuggestions([]); // Clear suggestions
    if (onSearch) {
      onSearch(suggestion.label); // Trigger search with the selected suggestion
    }
  };

  return (
    <div className="relative flex items-center justify-center mt-5">
      <form
        onSubmit={handleSearch}
        className="flex relative w-full max-w-3xl overflow-hidden rounded-md shadow-md"
      >
        {/* Input Field */}
        <input
          type="text"
          placeholder="Search Location"
          className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input} // Bind input value
          onChange={handleInputChange} // Update state on input
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full max-w-3xl bg-white border border-gray-300 rounded-md shadow-md mt-2 z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search_bar


