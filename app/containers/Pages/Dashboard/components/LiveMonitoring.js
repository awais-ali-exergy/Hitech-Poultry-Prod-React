import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, Paper, Typography, Stack, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";
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
import { format } from "date-fns";
import { fetchSensorReadings } from "../../../../redux/modules/farmSlice";
import { useDispatch } from "react-redux";
import { wsService } from "../../../../utils/websocketService";
import AlertMessage from "../../../../components/alertMessage/AlertMessage";
import {
  formatValue,
  dataKeyMap,
  metricConfigs,
  getDynamicDomain,
  defaultReadings,
  getMetricDefinitions,
} from "../util/monitoringUtils";
import HistoricalChart from "./HistoricalChart";

const MetricCard = styled(Paper)(({ theme, selected, color }) => ({
  padding: theme.spacing(1.5),
  paddingTop: 10,
  paddingBottom: 10,
  border: `1px solid ${
    selected ? theme.palette[color].main : theme.palette.grey[200]
  }`,
  borderRadius: 22,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    borderColor: theme.palette[color].main,
    boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.15)}`,
    "&::after": {
      opacity: 0.1,
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, ${theme.palette[color].main}, transparent)`,
    opacity: selected ? 0.05 : 0,
    transition: "opacity 0.2s ease-in-out",
  },
  ...(selected && {
    boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.15)}`,
  }),
}));
const LiveIndicator = styled("div")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  marginRight: theme.spacing(1),
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%": {
      opacity: 1,
      transform: "scale(1)",
    },
    "50%": {
      opacity: 0.5,
      transform: "scale(0.9)",
    },
    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },
}));
const LiveMonitoring = () => {
  const [selectedMetric, setSelectedMetric] = useState("temperature");
  const selectedMetricRef = useRef("temperature");
  const [liveData, setLiveData] = useState([]);
  const [latestReadings, setLatestReadings] = useState(defaultReadings);

  const [wsStatus, setWsStatus] = useState("Connecting...");
  const [alert, setAlert] = useState({
    open: false,
    severity: "info",
    message: "",
    actions: [],
  });
  const dispatch = useDispatch();
  const houseId = 1;

  const metrics = useMemo(
    () => getMetricDefinitions(latestReadings),
    [latestReadings]
  );

  // WebSocket connection and data handling
  useEffect(() => {
    const topic = `/topic/house/${2}`;

    const handleMessage = ({
      type,
      value,
      error,
      attempt,
      maxAttempts,
      canRetry,
    }) => {
      if (type === "status") {
        console.log(value);
        setWsStatus(value);
        if (value === "Failed") {
          setAlert({
            open: true,
            severity: "error",
            message: error || "Connection failed",
            actions: [
              {
                label: "Retry",
                onClick: () => wsService.retry(),
                closeOnClick: true,
              },
            ],
          });
        } else if (value === "Reconnecting") {
          setAlert({
            open: true,
            severity: "warning",
            message: `Reconnecting (Attempt ${attempt}/${maxAttempts})`,
            actions: [
              {
                label: "Cancel",
                onClick: () => wsService.disconnect(),
                closeOnClick: true,
              },
            ],
          });
        }
      } else if (type === "data") {
        // console.log("Sensor data received:", value);

        // Update latest readings with formatted values
        setLatestReadings({
          temperature: formatValue(value.temperature, "temperature"),
          humidity: formatValue(value.humidity, "humidity"),
          light: formatValue(value.lux, "light"),
          ammonia: formatValue(value.ammonia_ppm, "ammonia"),
        });

        // Store the raw data point with timestamp
        const timestamp = format(new Date(value.timestamp), "h:mm:ss");
        const mappedKey = dataKeyMap[selectedMetricRef.current];
        setLiveData((currentData) => {
          return [
            ...currentData,
            {
              time: timestamp,
              value: value[mappedKey].toFixed(2),
            },
          ].slice(-20);
        });
      }
    };

    wsService.connect(topic, handleMessage);

    return () => wsService.disconnect();
  }, []); // Empty dependency array - only run on mount/unmount
  console.log(liveData);

  // Separate effect for updating live data when selected metric changes
  useEffect(() => {
    selectedMetricRef.current = selectedMetric;
    setLiveData([]);
  }, [selectedMetric]);

  const selectedMetricData = metrics.find((m) => m.id === selectedMetric);
  const isLive = wsStatus === "Connected";

  return (
    <Box>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
        actions={alert.actions}
      />
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Real-Time Sensor Readings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Live streaming data updates for temperature, humidity, light, and
          ammonia levels
        </Typography>
      </Stack>
      {/* Connection Status */}
      {/* <Typography
        variant="subtitle2"
        color={wsStatus === "Connected" ? "success.main" : "warning.main"}
        sx={{ mb: 2 }}
      >
        WebSocket Status: {wsStatus}
      </Typography> */}

      {/* Metric Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 3,
          mb: 4,
          width: "100%",
        }}
      >
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            elevation={0}
            selected={selectedMetric === metric.id}
            color={metric.color}
            onClick={() => setSelectedMetric(metric.id)}
          >
            <Box
              sx={{
                bgcolor: (theme) =>
                  alpha(theme.palette[metric.color].main, 0.12),
                borderRadius: "50%",
                p: 1,
                display: "flex",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <Box sx={{ color: `${metric.color}.main` }}>{metric.icon}</Box>
            </Box>
            <Stack sx={{ zIndex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {metric.label}
              </Typography>
              <Typography
                fontSize="1.5rem"
                color={`${metric.color}.main`}
                fontWeight={500}
              >
                {metric.value}
              </Typography>
              {selectedMetric === metric.id && (
                <Typography variant="caption" color="text.secondary">
                  Range: {metric.min} - {metric.max}
                </Typography>
              )}
            </Stack>
          </MetricCard>
        ))}
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: "flex",
          gap: "24px",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Historical Chart */}
        <HistoricalChart
          selectedMetric={selectedMetric}
          selectedMetricData={selectedMetricData}
          fetchSensorReadings={(params) =>
            dispatch(fetchSensorReadings(params)).unwrap()
          }
        />

        {/* Live Chart */}
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {isLive && <LiveIndicator />}
            <Typography variant="h6" fontWeight={600}>
              Live Data {isLive ? "Streaming" : "Connecting..."}
            </Typography>
          </Box>
          <ResponsiveContainer height={450}>
            <LineChart data={liveData}>
              <CartesianGrid
                horizontal={true}
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="time"
                angle={90}
                height={60}
                textAnchor="start"
                interval={0}
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
                domain={getDynamicDomain(
                  Math.min(...liveData.map((d) => d.value)),
                  Math.max(...liveData.map((d) => d.value)),
                  selectedMetric
                )}
                tickCount={metricConfigs[selectedMetric].tickCount}
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
                isAnimationActive={false}
                type="monotone"
                dataKey="value"
                stroke={
                  selectedMetricData.color === "error" ? "#f44336" : "#2196f3"
                }
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default LiveMonitoring;
