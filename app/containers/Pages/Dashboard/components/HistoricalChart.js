import React, { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
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
import { alpha } from "@mui/material/styles";
import { format } from "date-fns";
import dayjs from "dayjs";
import DateRangePicker from "../../../../components/datePicker/DateRangePicker";

const HistoricalChart = ({
  selectedMetric,
  selectedMetricData,
  fetchSensorReadings,
}) => {
  const [dateRange, setDateRange] = useState({
    start: dayjs().subtract(24, "hour"),
    end: dayjs(),
  });
  const [historicalData, setHistoricalData] = useState([]);

  const handleSearch = async (range) => {
    try {
      const params = {
        range: "day",
        startDate: range.start.format("YYYY-MM-DDTHH:mm:ss"),
        endDate: range.end.format("YYYY-MM-DDTHH:mm:ss"),
      };

      const response = await fetchSensorReadings(params);

      if (response) {
        // Take one reading every 5 minutes (or adjust as needed)

        const formattedData = response.map((reading) => ({
          time: format(new Date(reading.timestamp), "HH:mm:ss"),
          temperature: reading.temperature.toFixed(1),
          humidity: reading.humidity.toFixed(1),
          light: reading.lux.toFixed(1),
          ammonia: reading.ammoniaPpm.toFixed(1),
        }));
        setHistoricalData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  useEffect(() => {
    handleSearch(dateRange);
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        p: 3,
        minWidth: 500,
        border: 1,
        borderColor: "grey.200",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Historical Data
        </Typography>
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onSearch={handleSearch}
        />
      </Box>

      <ResponsiveContainer height={450}>
        <LineChart data={historicalData}>
          <CartesianGrid
            horizontal={true}
            vertical={false}
            strokeDasharray="3 3"
          />{" "}
          <XAxis
            // interval={1}
            dataKey="time"
            angle={90}
            height={60}
            textAnchor="start"
            tick={{
              fontSize: "14px",
              fill: "#666666",
              fontWeight: 500,
              fontFamily: "Arial",
            }}
          />
          <YAxis
            label={{
              value:
                selectedMetricData.id === "temperature"
                  ? "°C"
                  : selectedMetricData.id === "humidity"
                  ? "%"
                  : selectedMetricData.id === "light"
                  ? "lux"
                  : "ppm",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
            tick={{
              fontSize: "14px",
              fill: "#666666",
              fontWeight: 500,
              fontFamily: "Arial",
            }}
          />
          <Tooltip />
          <ReferenceLine
            y={parseFloat(selectedMetricData.max)}
            stroke={alpha("#f44336", 0.5)}
            strokeDasharray="3 3"
            label={{ value: "Max", position: "right" }}
          />
          <ReferenceLine
            y={parseFloat(selectedMetricData.min)}
            stroke={alpha("#f44336", 0.5)}
            strokeDasharray="3 3"
            label={{ value: "Min", position: "right" }}
          />
          <Line
            type="monotone"
            dataKey={selectedMetric}
            stroke={
              selectedMetricData.color === "error" ? "#f44336" : "#2196f3"
            }
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default HistoricalChart;
