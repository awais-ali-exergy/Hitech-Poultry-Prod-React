import React, { useState, useEffect } from "react";
import { Box, Paper, Stack, Typography, CircularProgress } from "@mui/material";
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
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import DateRangePicker from "../../../../components/datePicker/DateRangePicker";
import HomeIcon from "@mui/icons-material/Home";
import StorageIcon from "@mui/icons-material/Storage";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { fetchSensorReadings } from "../../../../redux/modules/farmSlice";

const getDomain = (metric) => {
  switch (metric) {
    case "temperature":
      return [20, 30]; // Temperature range
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

const HistoricalChart = ({
  selectedPen,
  selectedMetric,
  selectedMetricData,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState({
    start: dayjs().subtract(1, "day"),
    end: dayjs(),
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (range) => {
    try {
      setError(null);
      setLoading(true);
      if (!selectedPen?.deviceId) return;

      const params = {
        deviceId: selectedPen.deviceId,
        timePeriod: range.isPreset ? range.timePeriod : "RANGE",
        ...(range.isPreset
          ? {}
          : {
              startDate: range.start.format("YYYY-MM-DD"),
              endDate: range.end.format("YYYY-MM-DD"),
            }),
      };

      await dispatch(fetchSensorReadings(params))
        .unwrap()
        .then((response) => {
          const formattedData = response.data.map((reading) => ({
            time: dayjs(reading.timeRangeStart).format("HH:mm"),
            temperature: reading.avgTemperature.toFixed(2),
            humidity: reading.avgHumidity.toFixed(2),
            light: reading.avgLux.toFixed(2),
            ammonia: reading.avgAmmonia.toFixed(2),
          }));
          setHistoricalData(formattedData);
        });
    } catch (error) {
      console.error("Error fetching historical data:", error);
      setError(error.message || "Failed to fetch sensor readings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPen?.deviceId) {
      handleSearch({ isPreset: true, timePeriod: "TODAY" });
    }
  }, [selectedPen?.deviceId]);

  const renderEmptyState = () => {
    if (loading) {
      return (
        <Box
          sx={{
            height: 250,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.50",
            borderRadius: 1,
          }}
        >
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={48} />
            <Typography color="text.secondary">
              Loading sensor data...
            </Typography>
          </Stack>
        </Box>
      );
    }

    if (error) {
      return (
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
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                p: 2,
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.error.main, 0.1),
              }}
            >
              <ErrorOutlineIcon
                sx={{ fontSize: 48, color: theme.palette.error.main }}
              />
            </Box>
            <Stack alignItems="center" spacing={1}>
              <Typography color="error" fontWeight={500}>
                Error fetching data
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
                sx={{ maxWidth: 300 }}
                align="center"
              >
                {error}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      );
    }

    if (!selectedPen?.deviceId) {
      return (
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
          {" "}
          <Stack spacing={2} alignItems="center">
            <HomeIcon
              sx={{ fontSize: 48, color: theme.palette.text.secondary }}
            />
            <Typography color="text.secondary">
              Please select a pen to view historical sensor data
            </Typography>
          </Stack>
        </Box>
      );
    }

    return (
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
        {" "}
        <Stack spacing={2} alignItems="center">
          <StorageIcon
            sx={{ fontSize: 48, color: theme.palette.text.secondary }}
          />
          <Typography color="text.secondary">
            No data available for the selected time period
          </Typography>
        </Stack>
      </Box>
    );
  };

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
        {selectedPen?.deviceId && (
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onSearch={handleSearch}
          />
        )}
      </Box>

      {!selectedPen?.deviceId ||
      historicalData.length === 0 ||
      error ||
      loading ? (
        renderEmptyState()
      ) : (
        <ResponsiveContainer height={250}>
          <LineChart data={historicalData}>
            <CartesianGrid
              horizontal={true}
              vertical={false}
              strokeDasharray="3 3"
            />
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
              domain={getDomain(selectedMetric)}
              label={{
                value: selectedMetricData.unit,
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
              tick={{
                fontSize: "12px",
                fill: theme.palette.text.secondary,
                fontWeight: 500,
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
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default HistoricalChart;
