"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addRecord } from "@/services/FirestoreService";
import { ComplaintRecord } from "@/models/ComplaintRecord";

const Create_record = () => {
  // State variables for form fields
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [safeword, setSafeword] = useState("");
  const [confirm_sw, setConfirm_sw] = useState("");
  const [issue, setIssue] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  // Handle form submission
  const handleAddRecord = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (safeword != confirm_sw) {
      alert("Safe words do not match. Please confirm again.");
      return;
    }

    // Create record object
    const record = {
      date,
      location,
      status,
      issue,
      safeword,
    };

    try {
      const response = await fetch("/api/create_record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add record");
      }

      alert(
        `Record added successfully! Your receipt: ${data.receiptString}. Please keep it safely, you will need it when updating the record.`
      );

      // Clear form fields
      setDate("");
      setLocation("");
      setStatus("");
      setSafeword("");
      setIssue("");
      setConfirm_sw("");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
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

          {/* issue field */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Issue</label>
            <input
              type="text"
              placeholder="Enter Complaint Issue"
              className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
            />
          </div>

          {/* Safe Word Field */}
          <div className="mb-2">
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
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Confirm Your Safe Word
            </label>
            <input
              type="text"
              placeholder="Enter safe word again"
              className={`w-full px-3 py-2 border rounded-md focus:outline-blue-500 ${
                confirm_sw && safeword !== confirm_sw ? "border-red-500" : ""
              }`}
              value={confirm_sw}
              onChange={(e) => {
                setConfirm_sw(e.target.value);
                setError(safeword !== e.target.value);
              }}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
              onClick={() => router.back()} // Navigate back
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
