"use client";
import React, { useState } from "react";
import { addRecord } from "@/services/FirestoreService";
import { ComplaintRecord } from "@/models/ComplaintRecord";

const Create_record = () => {
  // State variables for form fields
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [safeword, setSafeword] = useState("");

  // Handle form submission
  const handleAddRecord = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    // Create a new record using ComplaintRecord
    const record = {
      ...ComplaintRecord,
      date: date,
      location: location,
      status: status,
      safeword: safeword,
    };

    // Add the record to Firestore
    try {
      await addRecord(record);
      alert("Record added successfully!");
      setDate("");
      setLocation("");
      setStatus("");
      setSafeword("");
    } catch (error) {
      console.error("Error adding record:", error);
      alert("Failed to add record.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">Add A Record</h2>

        <form onSubmit={handleAddRecord}>
          {/* Date Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Location Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Location</label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="">Select Location</option>
              <option value="Pittsburgh">Pittsburgh</option>
              <option value="Other Locations">Other Locations</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="submitted">Submitted</option>
              <option value="received update">Received Update</option>
              <option value="addressed">Addressed</option>
            </select>
          </div>

          {/* Safe Word Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Safe Word</label>
            <input
              type="text"
              placeholder="Enter safe word"
              className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
              value={safeword}
              onChange={(e) => setSafeword(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create_record;
