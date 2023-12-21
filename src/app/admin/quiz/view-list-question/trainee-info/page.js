"use client";
import React, { useEffect, useState } from "react";

export default function StudentInfo({ student, onSelect, onCheck, onScoreChange }) {
  const [inputValue, setInputValue] = useState(student?.updateScore ?? student?.score ?? '');

  useEffect(() => {
    setInputValue(student?.updateScore ?? student?.score ?? '');
  }, [student]);

  const handleCheckboxChange = (e) => {
    onCheck(e.target.checked);
  };

  const handleInputChange = (e) => {
    let newValue = e.target.value;
    if (newValue.trim() === "" || isNaN(newValue)) {
      newValue = null; // cho phép xóa điểm
    } else {
      newValue = parseFloat(newValue);
    }
    setInputValue(newValue);
    onScoreChange(student._id, newValue);
  };

  return (
    <li
      class="px-4 py-4 flex flex-col sm:flex-row items-center sm:px-6"
      onClick={() => onSelect(student)}
    >
      <input
        type="checkbox"
        class="mr-4 h-4 w-4 text-indigo-600 border-gray-300 rounded"
        checked={student.selected}
        onChange={handleCheckboxChange}
      />
      <img
        class="h-10 w-10 rounded-full mr-4"
        src="https://placehold.co/100x100"
        alt="Placeholder avatar for student"
      />
      <div class="min-w-0 flex-1 mb-2 sm:mb-0">
        <p class="text-sm font-medium text-gray-900 truncate">
          {student.user?.lastName}
        </p>
      </div>
      <div class="ml-4 flex-shrink-0">
        <input
          type="text"
          class="text-sm text-gray-500 border-l-2 pl-4"
          value={inputValue ?? ""}
          onChange={handleInputChange}
          placeholder="_"
        />
        <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
          /10
        </span>
      </div>
    </li>
  );
}
