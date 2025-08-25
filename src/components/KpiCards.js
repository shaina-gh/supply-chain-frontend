import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const KpiCards = () => {
  const [stats, setStats] = useState({
    totalShipments: 0,
    avgWaitingTime: 0,
    topDelayReason: "N/A",
  });

  useEffect(() => {
    axios
      .get("https://supply-chain-backend-mf8h.onrender.com/api/kpi-summary")
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Error fetching KPI data:", error));
  }, []);

  return (
    <Grid container spacing={3} style={{ marginBottom: "20px" }}>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Shipments
            </Typography>
            <Typography variant="h5">{stats.totalShipments}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Avg. Waiting Time (min)
            </Typography>
            <Typography variant="h5">{stats.avgWaitingTime}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Top Delay Reason
            </Typography>
            <Typography variant="h5">{stats.topDelayReason}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default KpiCards;
