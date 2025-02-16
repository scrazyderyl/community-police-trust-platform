"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import router

const update_protal = () => {
  const [receiptString, setReceiptString] = useState("");
  const router = useRouter();

  const handleFindRecord = async () => {
    if (!receiptString.trim()) {
      alert("Please enter a receipt string");
      return;
    }

    try {
      const response = await fetch("/api/find_by_receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptString }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch record");
      }

      router.push(`/update_record/update_portal/update_page/${data.record.id}`); // Navigate to update page
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="bg-white p-4 rounded-md shadow-md w-5/6 md:w-4/6 mt-10 max-h-[150px] flex flex-col justify-center">
        <h2 className="text-lg font-bold mb-2">Update Your Record</h2>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Enter Receipt String"
          className="w-full px-2 py-1 border rounded-md focus:outline-blue-500"
          value={receiptString}
          onChange={(e) => setReceiptString(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-400 text-white px-2 py-1 mr-4 rounded-md text-md hover:bg-gray-500"
            onClick={() => router.back()}
          >
            Back
          </button>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-md text-md hover:bg-blue-600"
            onClick={handleFindRecord}
          >
            Find Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default update_protal;
