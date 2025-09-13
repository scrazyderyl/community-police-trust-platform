"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { municipalities } from "@/public/municipalities";

const UpdateRecordPage = () => {
  const { id } = useParams(); // Get record ID from URL
  const router = useRouter();
  const [record, setRecord] = useState({
    date: "",
    location: "",
    status: "",
    issue: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`/api/find_by_id`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch record");
        }

        setRecord(data.record);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading record...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const handleUpdateRecord = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/update_record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          date: record.date,
          location: record.location,
          status: record.status,
          issue: record.issue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update record");
      }

      alert("Record updated successfully!");
      router.push("/community_tracker"); // Redirect after update
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">Update Record</h2>

        <form onSubmit={handleUpdateRecord}>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
            value={record.date}
            onChange={(e) => setRecord({ ...record, date: e.target.value })}
            required
          />

          <label className="block text-sm font-medium mt-4 mb-1">
            Location
          </label>
          <select
            className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
            value={record.location}
            onChange={(e) => setRecord({ ...record, location: e.target.value })}
            required
          >
            <option value="">Select Location</option>
            {municipalities.map((municipality, index) => (
              <option key={index} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mt-4 mb-1">Status</label>
          <select
            className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
            value={record.status}
            onChange={(e) => setRecord({ ...record, status: e.target.value })}
            required
          >
            <option value="">Select Status</option>
            <option value="submitted">Submitted</option>
            <option value="received update">Received Update</option>
            <option value="addressed">Addressed</option>
          </select>

          <label className="block text-sm font-medium mt-4 mb-1">Issue</label>
          <input
            type="text"
            placeholder="Enter Complaint Issue"
            className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
            value={record.issue}
            onChange={(e) => setRecord({ ...record, issue: e.target.value })}
            required
          />

          {/* Buttons */}
          <div className="flex justify-between mt-4">
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRecordPage;
