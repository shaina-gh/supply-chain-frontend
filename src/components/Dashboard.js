import React, { useState, useEffect } from "react";
import axios from "axios";
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
import LocationMap from "./LocationMap";
import "./Dashboard.css";

const COLORS = ["#FFBB28", "#00C49F", "#0088FE", "#FF8042"];
const RENDER_API_URL = "https://supply-chain-backend-mf8h.onrender.com";

const Dashboard = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [assetListResponse, pieResponse] = await Promise.all([
          axios.get(`${RENDER_API_URL}/api/logistics?asset=All`),
          axios.get(`${RENDER_API_URL}/api/delay-reasons`),
        ]);

        const uniqueAssets = [
          ...new Set(assetListResponse.data.map((item) => item.asset_id)),
        ];
        setAssetList(uniqueAssets);
        setPieChartData(pieResponse.data);
      } catch (error) {
        console.error("Error fetching static data:", error);
      }
    };
    fetchStaticData();
  }, []);

  useEffect(() => {
    const fetchBarData = async () => {
      const assetFilter = selectedAsset || "All";
      // --- FIX: Use the RENDER_API_URL variable correctly ---
      const endpoint = `${RENDER_API_URL}/api/logistics?asset=${assetFilter}`;
      try {
        const response = await axios.get(endpoint);
        setBarChartData(response.data);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };
    fetchBarData();
  }, [selectedAsset]);

  return (
    <div className="dashboard-container">
      <h1>Supply Chain Dashboard</h1>
      <div className="charts-grid">
        <div className="chart-wrapper">
          <div className="chart-header">
            <h2>Average Waiting Time by Asset</h2>
            <FormControl
              size="small"
              style={{ minWidth: 120 }}
              disabled={assetList.length === 0}
            >
              <InputLabel>Asset</InputLabel>
              <Select
                value={selectedAsset}
                label="Asset"
                onChange={(e) => setSelectedAsset(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {assetList.map((asset) => (
                  <MenuItem key={asset} value={asset}>
                    {asset}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
