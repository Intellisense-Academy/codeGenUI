import React, { useState, useEffect } from 'react';
import { Box, Button } from "@mui/material";

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - i); // Last 4 years

const DateFilter = ({ selectedDate, setSelectedDate }) => {
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());

  // Automatically update the selectedDate whenever month/year changes
  useEffect(() => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    setSelectedDate(newDate);
  }, [selectedMonth, selectedYear]);

  const handleMonthChangeClick = (offset) => {
    const newDate = new Date(selectedYear, selectedMonth + offset, 1);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
    // setSelectedDate is triggered automatically by useEffect
  };

  return (
    <Box sx={{ marginTop: "70px", padding: "10px 30px", display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button variant="contained" onClick={() => handleMonthChangeClick(-1)}>Previous Month</Button>

      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
        style={{ padding: '8px', fontSize: '16px' }}
      >
        {months.map((month, index) => (
          <option key={index} value={index}>{month}</option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        style={{ padding: '8px', fontSize: '16px' }}
      >
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <Button variant="contained" onClick={() => handleMonthChangeClick(1)}>Next Month</Button>
    </Box>
  );
};

export default DateFilter;
