"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { municipalities } from "@/public/municipalities";

const Create_record = () => {
  // State variables for form fields
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true); // Track email validity
  const [receiptString, setReceiptString] = useState(null); // Store receipt
  const router = useRouter();

  // Function to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleAddRecord = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Validate email before submitting
    if (!validateEmail(email)) {
      setIsEmailValid(false);
      alert("Please enter a valid email address.");
      return;
    }

    // Create record object
    const record = {
      date,
      location,
      status,
      issue,
      email,
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

      // Store the receipt string and show the popup
      setReceiptString(data.receiptString);

      // Clear form fields
      setDate("");
      setLocation("");
      setStatus("");
      setEmail("");
      setIssue("");
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
              {municipalities.map((municipality, index) => (
                <option key={index} value={municipality}>
                  {municipality}
                </option>
              ))}
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

          {/* Email Field */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              placeholder="Enter your email address"
              className={`w-full px-3 py-2 border rounded-md focus:outline-blue-500 ${
                isEmailValid ? "border-gray-300" : "border-red-500"
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailValid(validateEmail(e.target.value)); // Validate email on change
              }}
              required
            />
            {!isEmailValid && (
              <p className="text-red-500 text-xs mt-1">Invalid email format</p>
            )}
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
      {/* Receipt Popup */}
      {receiptString && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[350px] text-center">
            <h3 className="text-lg font-semibold mb-4">
              Record Created Successfully!
            </h3>
            <p>Your receipt string:</p>
            <p className="text-blue-600 font-bold text-lg mt-2">
              {receiptString}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              The receipt string has been sent to your email. If you don’t find
              it in your inbox, please check your spam/junk folder.
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => setReceiptString(null)} // Close popup
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create_record;
