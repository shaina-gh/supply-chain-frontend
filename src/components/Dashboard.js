import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

import KpiCards from "./KpiCards"; // Import the KPI component
import LocationMap from "./LocationMap"; // Import the Map component
import "./Dashboard.css";

const COLORS = ["#FFBB28", "#00C49F", "#0088FE", "#FF8042"];

const Dashboard = () => {
  // --- All state hooks must be inside the component ---
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [startDate, setStartDate] = useState(null); // Date picker state
  const [endDate, setEndDate] = useState(null); // Date picker state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- Pass dates and asset filter to the API calls ---
        const params = {
          asset: selectedAsset || "All",
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null,
        };

        const [assetListResponse, pieResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/logistics", { params }),
          axios.get("http://localhost:5000/api/delay-reasons", { params }),
        ]);

        // Only update the asset list on the initial load to prevent it from changing
        if (assetList.length === 0) {
          const uniqueAssets = [
            ...new Set(assetListResponse.data.map((item) => item.asset_id)),
          ];
          setAssetList(uniqueAssets);
        }

        setBarChartData(assetListResponse.data);
        setPieChartData(pieResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // Re-fetch data whenever a filter changes
  }, [selectedAsset, startDate, endDate]);

  return (
    <div className="dashboard-container">
      <h1>Supply Chain Dashboard</h1>

      {/* --- KPI CARDS --- */}
      <KpiCards />

      {/* --- FILTER CONTROLS WRAPPER --- */}
      <div className="filter-controls">
        <FormControl size="small" style={{ minWidth: 150 }}>
          <InputLabel>Asset</InputLabel>
          <Select
            value={selectedAsset}
            label="Asset"
            onChange={(e) => setSelectedAsset(e.target.value)}
            disabled={assetList.length === 0}
          >
            <MenuItem value="">All</MenuItem>
            {assetList.map((asset) => (
              <MenuItem key={asset} value={asset}>
                {asset}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="date-picker"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          className="date-picker"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-wrapper">
          <div className="chart-header">
            <h2>Average Waiting Time by Asset</h2>
          </div>
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="asset_id"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="average_waiting_time"
                  fill="#8884d8"
                  name="Average Waiting Time (minutes)"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading chart data...</p>
          )}
        </div>

        <div className="chart-wrapper">
          <h2>Count of Delays by Reason</h2>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={400}
              key={pieChartData.length}
            >
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="logistics_delay_reason"
                  label={(entry) =>
                    `${entry.logistics_delay_reason}: ${entry.count}`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading chart data...</p>
          )}
        </div>

        {/* --- Correct placement for the Map --- */}
        <div className="chart-wrapper full-width">
          <h2>Live Asset Locations</h2>
          <div style={{ height: "400px", width: "100%" }}>
            <LocationMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
