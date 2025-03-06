import React from "react";
import { Box, Paper, Typography, Stack, alpha, useTheme } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { selectLiveReadings } from "../../../../redux/modules/farmSlice";
import { useSelector } from "react-redux";

const LiveChart = ({ selectedPen, selectedMetric, selectedMetricData }) => {
  const theme = useTheme();
  const liveReadings = useSelector(selectLiveReadings);

  // Transform the data to use raw values
  const transformedData =
    liveReadings.history?.map((reading) => ({
      time: reading.time,
      value: reading.value
        ? selectedMetric === "temperature"
          ? reading.value.temperature
          : selectedMetric === "humidity"
          ? reading.value.humidity
          : selectedMetric === "light"
          ? reading.value.lux
          : selectedMetric === "ammonia"
          ? reading.value.ammonia_ppm
          : 0
        : 0,
    })) || [];

  // Get domain based on metric
  const getDomain = () => {
    switch (selectedMetric) {
      case "temperature":
        return [15, 35]; // Temperature range
      case "humidity":
        return [60, 90]; // Humidity range
      case "light":
        return [0, 100]; // Light range
      case "ammonia":
        return [0, 1]; // Ammonia range
      default:
        return ["auto", "auto"];
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Live Data
      </Typography>
      {!selectedPen || !transformedData.length ? (
        <Box
          sx={{
            height: 250,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: theme.palette.action.hover,
            borderRadius: 1,
          }}
        >
          <Typography color="text.secondary">
            {!selectedPen
              ? "Select a pen to view live data"
              : "Waiting for live data..."}
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer height={250}>
          <LineChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              height={50}
              interval="preserveStartEnd"
              tick={{
                fontSize: 12,
                fill: theme.palette.text.secondary,
                dy: 10,
              }}
            />
            <YAxis
              domain={getDomain()}
              label={{
                value: selectedMetricData.unit,
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
              tick={{
                fontSize: 12,
                fill: theme.palette.text.secondary,
              }}
            />
            <Tooltip
              formatter={(value) => [
                `${value.toFixed(2)} ${selectedMetricData.unit}`,
                "Value",
              ]}
            />
            <ReferenceLine
              y={parseFloat(selectedMetricData.max)}
              stroke={alpha(theme.palette.error.main, 0.5)}
              strokeDasharray="3 3"
              label={{ value: "Max", position: "right" }}
            />
            <ReferenceLine
              y={parseFloat(selectedMetricData.min)}
              stroke={alpha(theme.palette.error.main, 0.5)}
              strokeDasharray="3 3"
              label={{ value: "Min", position: "right" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={true}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default LiveChart;
