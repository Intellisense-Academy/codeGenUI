import { useState, useEffect } from 'react';
import { Box} from "@mui/material";
import Header from '../../components/Header';
import DateFilter from '../../components/DateFilter';
import Pie from "../../components/piechart";
import Bar from "../../components/Barchart";

const Dashboard = () => {
  const [allData, setAllData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // state to track selected month

  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  const base64Credentials = btoa(`${email}:${password}`);

  const getStartAndEndDate = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
    return { startDate: start, endDate: end };
  };

  const fetchAllData = async (date) => {
    const { startDate, endDate } = getStartAndEndDate(date);
    try {
      const response = await fetch('http://localhost:8080/search/contributor/data', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64Credentials}`
        },
        body: JSON.stringify({ startDate, endDate })
      });

      if (response.ok) {
        const json = await response.json();
        setAllData(json.data);
      } else {
        alert("Access denied or login expired");
      }
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchAllData(selectedDate);
  }, [selectedDate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Sticky Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          zIndex: 1300,
          bgcolor: "background.paper",
          boxShadow: 1,
        }}
      >
        <Header />
      </Box>

      {/* Date Filter Controls */}
      <DateFilter selectedDate={selectedDate} setSelectedDate={setSelectedDate} />


      {/* Charts */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems:"center" }}>
        {allData?.total && <Pie rawdata={allData.total} />}
        {allData?.amount && <Bar info={allData.amount} />}
        
      </Box>
    </Box>
  );
};

export default Dashboard;
