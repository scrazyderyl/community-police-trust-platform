"use client";
import React, {useState, useEffect} from 'react';
import { addRecord, updateRecord, getRecords, deleteRecord } from '@/services/FirestoreService';
import { ComplaintRecord } from '@/models/ComplaintRecord';

const Community_tracker = () => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ date: "", location: "", status:"" });
  const [summary, setSummary] = useState({});

  useEffect(()=>{
    fetchRecords();
  }, []);

  const fetchRecords = async() => {
    const recordsData = await getRecords();
    setRecords(recordsData);
    summarizeRecords(recordsData);
  }

  // summarize the status of the records based on their location
  const summarizeRecords = (data) => {
    const summaryObj = {};

    data.forEach((record) => {
      const location = record.location;
      const status = record.status;

      if (!summaryObj[location]) {
        summaryObj[location] = {
          submitted: 0,
          inProgress: 0,
          addressed: 0,
        };
      }

      // Count based on status
      if (status === "submitted") {
        summaryObj[location].submitted += 1;
      } else if (status === "received update") {
        summaryObj[location].inProgress += 1;
      } else if (status === "addressed") {
        summaryObj[location].addressed += 1;
      }
    });

    setSummary(summaryObj);
  };

  // add a record. Will be moved to add record page later
  const handleAddRecord = async() => {
    const record = {
      ...ComplaintRecord,
      date: "2025-01-07",
      location: "Pittsburgh",
      status: "Filed"
    };
    await addRecord(record);
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mt-12">
        Misconduct Complaint Record
        From Community
      </h1>
      {/* Informational Text */}
<p className="w-3/4 text-center text-black-500 text-sm mt-4 leading-relaxed">
  This page contains community-reported cases when they filed a police complaint in Allegheny County.
  The data will not be complete since not all community members use this site. We show only the counts,
  and nothing personal is collected or shown here. We also show data from the last one year.
</p>

      {/* Add Record Button and Help Icon */}
      <div className="flex items-center justify-center mt-6 space-x-4">
        <a href="/create_record" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md">
          + Add Record
        </a>
        <a href="/update_record/update_portal" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md">
          Update Record
        </a>
      </div>
  
      {/* Records Table */}
      <div className="mt-10 w-3/4">
      <table className="w-full border-collapse border border-gray-300 text-center">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="py-3 px-6 border">Location</th>
            <th className="py-3 px-6 border">Submitted Records</th>
            <th className="py-3 px-6 border">Records In Progress</th>
            <th className="py-3 px-6 border">Records Addressed</th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(summary).length > 0 ? (
            Object.entries(summary).map(([location, counts], index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}`}
              >
                <td className="py-4 border">{location}</td>
                <td className="py-4 border">{counts.submitted}</td>
                <td className="py-4 border">{counts.inProgress}</td>
                <td className="py-4 border">{counts.addressed}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
  
}

export default Community_tracker