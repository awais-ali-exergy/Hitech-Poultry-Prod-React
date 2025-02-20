import React, { useState, useEffect } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
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
import { alpha, useTheme } from "@mui/material/styles";
import { format } from "date-fns";
import dayjs from "dayjs";
import DateRangePicker from "../../../../components/datePicker/DateRangePicker";
import HomeIcon from "@mui/icons-material/Home";
import StorageIcon from "@mui/icons-material/Storage";

const HistoricalChart = ({
  selectedMetric,
  selectedMetricData,
  fetchSensorReadings,
  deviceId,
}) => {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState({
    start: dayjs().subtract(1, "day"),
    end: dayjs(),
  });
  const [historicalData, setHistoricalData] = useState([]);

  const handleSearch = async (range) => {
    try {
      if (!deviceId) return;

      const params = {
        deviceId,
        timePeriod: range.isPreset ? range.timePeriod : "RANGE",
      };

      if (!range.isPreset) {
        params.startDate = range.start.format("YYYY-MM-DD");
        params.endDate = range.end.format("YYYY-MM-DD");
      }

      const response = await fetchSensorReadings(params);

      if (response) {
        const formattedData = response.data.map((reading) => {
          if (reading.timeRangeStart) {
            return {
              time: format(new Date(reading.timeRangeStart), "HH:mm:ss"),
              temperature: reading.avgTemperature.toFixed(1),
              humidity: reading.avgHumidity.toFixed(1),
              light: reading.avgLux.toFixed(1),
              ammonia: reading.avgAmmonia.toFixed(1),
            };
          }

          return {
            time: reading.timeSlot || format(new Date(reading.date), "MMM dd"),
            temperature: reading.avgTemperature.toFixed(1),
            humidity: reading.avgHumidity.toFixed(1),
            light: reading.avgLux.toFixed(1),
            ammonia: reading.avgAmmonia.toFixed(1),
          };
        });

        setHistoricalData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  useEffect(() => {
    if (deviceId) {
      handleSearch({ isPreset: true, timePeriod: "TODAY" });
    }
  }, [deviceId]);

  const emptyStateBackground = theme.palette.action.hover;

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
        {deviceId && (
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onSearch={handleSearch}
          />
        )}
      </Box>

      {!deviceId ? (
        <Box
          sx={{
            height: 450,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
            bgcolor: emptyStateBackground,
          }}
        >
          <Stack spacing={2} alignItems="center">
            <HomeIcon
              sx={{
                fontSize: 48,
                color: theme.palette.text.secondary,
              }}
            />
            <Typography color="text.secondary">
              Please select a pen to view historical sensor data
            </Typography>
          </Stack>
        </Box>
      ) : historicalData.length === 0 ? (
        <Box
          sx={{
            height: 450,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
            bgcolor: emptyStateBackground,
          }}
        >
          <Stack spacing={2} alignItems="center">
            <StorageIcon
              sx={{
                fontSize: 48,
                color: theme.palette.text.secondary,
              }}
            />
            <Typography color="text.secondary">
              No data available for the selected time period
            </Typography>
          </Stack>
        </Box>
      ) : (
        <ResponsiveContainer height={450}>
          <LineChart data={historicalData}>
            <CartesianGrid
              horizontal={true}
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="time"
              angle={45}
              height={60}
              textAnchor="start"
              tick={{
                fontSize: "14px",
                fill: theme.palette.text.secondary,
                fontWeight: 500,
                fontFamily: theme.typography.fontFamily,
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
                fill: theme.palette.text.secondary,
                fontWeight: 500,
                fontFamily: theme.typography.fontFamily,
              }}
            />
            <Tooltip />
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
              dataKey={selectedMetric}
              stroke={
                selectedMetricData.color === "error"
                  ? theme.palette.error.main
                  : theme.palette.primary.main
              }
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default HistoricalChart;
