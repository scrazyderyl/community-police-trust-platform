"use client"
import React, { useState } from 'react'

// Destructure show_map_btn and onSearch from props
const Search_bar = ({ show_map_btn, onSearch }) => {
  const [input, setInput] = useState('') // Manage input state

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (onSearch) {
      onSearch(input); // Pass the input value to the parent function
    }
  }

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white p-5 shadow-sm">
        <form 
          onSubmit={handleSearch} 
          className="flex overflow-hidden rounded-md bg-gray-200 focus:outline focus:outline-blue-500"
        >
          {/* Input Field */}
          <input 
            type="text" 
            placeholder="Search Location"
            className="w-full rounded-bl-md rounded-tl-md bg-gray-100 px-4 py-2.5 text-gray-700 focus:outline-blue-500"
            value={input} // Bind input value
            onChange={(e) => setInput(e.target.value)} // Update state on input
          />
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn_sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5"
              stroke="currentColor" 
              className="size-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" 
              />
            </svg>
          </button>
          
          {/* Conditionally Render Map Button */}
          {show_map_btn && (
            <a 
              href="/map_mode"
              className="btn_md ml-2 bg-blue-500 px-5 text-white duration-150 hover:bg-blue-600 rounded-md"
            >
              Map
            </a>
          )}
        </form>
      </div>
    </div>
  )
}

export default Search_bar

