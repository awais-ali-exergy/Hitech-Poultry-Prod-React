import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

// Generate dates starting from August 28, 2023
const generateDates = (startDate, numWeeks) => {
  const dates = [];
  let currentDate = dayjs(startDate);

  for (let i = 0; i < numWeeks; i++) {
    dates.push({
      date: currentDate.format("D MMM YYYY"),
      week: `Week ${i + 1}`,
    });
    currentDate = currentDate.add(7, "day");
  }
  return dates;
};

const dates = generateDates("2023-08-28", 24);

// Feed consumption data with updated metrics
const feedData = dates.map((dateObj, index) => ({
  week: dateObj.week,
  actual: 20 + index * 4,
  standard: 25 + index * 4,
  date: dateObj.date,
}));

// Light hours data
const lightData = dates.map((dateObj, index) => ({
  week: dateObj.week,
  actual: index === 0 ? 23 : index % 10 === 0 ? 9 : 8,
  standard: 8,
  date: dateObj.date,
}));

// Body weight data with updated metrics
const weightData = dates.map((dateObj, index) => ({
  week: dateObj.week,
  actual: 200 + index * 120,
  standard: 250 + index * 115,
  date: dateObj.date,
}));

const chartCommonProps = {
  xAxisProps: {
    dataKey: "week",
    angle: 90,
    height: 60,
    textAnchor: "start",
    tick: {
      fontSize: "14px",
      fill: "#666666",
      fontWeight: 500,
      fontFamily: "Arial",
    },
  },
  yAxisProps: {
    tick: {
      fontSize: "14px",
      fill: "#666666",
      fontWeight: 500,
      fontFamily: "Arial",
    },
  },
  legendProps: {
    verticalAlign: "top",
    height: 36,
  },
};

const DashboardCharts = () => {
  return (
    <Grid container spacing={3}>
      {/* Feed Consumption Chart */}
      <Grid item xs={6}>
        <Paper
          elevation={0}
          sx={{ p: 3, border: 1, borderColor: "grey.200", borderRadius: 2 }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Feed in Gram Consumption
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={feedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis {...chartCommonProps.xAxisProps} />
                <YAxis
                  {...chartCommonProps.yAxisProps}
                  label={{ value: "Grams", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend {...chartCommonProps.legendProps} />
                <Line
                  type="monotone"
                  dataKey="standard"
                  stroke="#ff0000"
                  name="Standard"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#2196f3"
                  name="Actual"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Body Weight Chart */}
      <Grid item xs={6}>
        <Paper
          elevation={0}
          sx={{ p: 3, border: 1, borderColor: "grey.200", borderRadius: 2 }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Body Weight
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis {...chartCommonProps.xAxisProps} />
                <YAxis
                  {...chartCommonProps.yAxisProps}
                  label={{ value: "Grams", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend {...chartCommonProps.legendProps} />
                <Line
                  type="monotone"
                  dataKey="standard"
                  stroke="#ff0000"
                  name="Standard"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#2196f3"
                  name="Actual"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Light Hours Chart */}
      <Grid item xs={6}>
        <Paper
          elevation={0}
          sx={{ p: 3, border: 1, borderColor: "grey.200", borderRadius: 2 }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Light Hours (up to 64 Week)
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis {...chartCommonProps.xAxisProps} />
                <YAxis
                  {...chartCommonProps.yAxisProps}
                  label={{
                    value: "Light Hours Per Day",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend {...chartCommonProps.legendProps} />
                <Line
                  type="monotone"
                  dataKey="standard"
                  stroke="#ff0000"
                  name="Standard"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#2196f3"
                  name="Actual"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Body Weight Pen Wise Chart */}
      <Grid item xs={6}>
        <Paper
          elevation={0}
          sx={{ p: 3, border: 1, borderColor: "grey.200", borderRadius: 2 }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Body Weight Pen Wise
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis {...chartCommonProps.xAxisProps} />
                <YAxis
                  {...chartCommonProps.yAxisProps}
                  label={{ value: "Grams", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend {...chartCommonProps.legendProps} />
                <Line
                  type="monotone"
                  dataKey="standard"
                  stroke="#ff0000"
                  name="Standard"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardCharts;
