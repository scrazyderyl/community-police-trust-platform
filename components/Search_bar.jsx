"use client"
import React from 'react'
import { useState } from 'react'

// Destructure show_map_btn from props
const Search_bar = ({ show_map_btn }) => {
  const [input, setInput] = useState('')

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white p-5 shadow-sm">
        <div className="flex overflow-hidden rounded-md bg-gray-200 focus:outline focus:outline-blue-500">
          <input 
            type="text" 
            placeholder="Search Location"
            className="w-full rounded-bl-md rounded-tl-md bg-gray-100 px-4 py-2.5 text-gray-700 focus:outline-blue-500"
          />
          <button type="submit" className="btn_sm">
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
        </div>
      </div>
    </div>
  )
}

export default Search_bar
