import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography, Stack, alpha, useTheme } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
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
import { wsService } from "../../../../utils/websocketService";
import {
  formatValue,
  dataKeyMap,
  metricConfigs,
  getDynamicDomain,
} from "../util/monitoringUtils";

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

const LiveChart = ({
  selectedPen,
  selectedMetric,
  selectedMetricData,
  onLatestReadingsUpdate,
  onAlertChange,
}) => {
  const theme = useTheme();
  const [liveData, setLiveData] = useState([]);
  const [wsStatus, setWsStatus] = useState("Connecting...");
  const selectedMetricRef = useRef(selectedMetric);

  useEffect(() => {
    if (!selectedPen?.deviceId) {
      setLiveData([]);
      return;
    }

    const topic = `/topic/house/${selectedPen?.deviceId}`;

    const handleMessage = ({
      type,
      value,
      error,
      attempt,
      maxAttempts,
      canRetry,
    }) => {
      if (type === "status") {
        setWsStatus(value);
        if (value === "Failed") {
          onAlertChange({
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
          onAlertChange({
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
        console.log(value);
        onLatestReadingsUpdate({
          temperature: formatValue(value.temperature, "temperature"),
          humidity: formatValue(value.humidity, "humidity"),
          light: formatValue(value.lux, "light"),
          ammonia: formatValue(value.ammonia_ppm, "ammonia"),
        });

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
  }, [selectedPen?.deviceId]);

  useEffect(() => {
    selectedMetricRef.current = selectedMetric;
    setLiveData([]);
  }, [selectedMetric]);

  const isLive = wsStatus === "Connected";

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        p: 3,
        minWidth: 500,
        border: 1,
        borderColor: theme.palette.divider,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {isLive && selectedPen && <LiveIndicator />}
        <Typography variant="h6" fontWeight={600}>
          {!selectedPen
            ? "No Pen Selected"
            : `Live Data ${isLive ? "Streaming" : "Connecting..."}`}
        </Typography>
      </Box>
      {!selectedPen ? (
        <Box
          sx={{
            height: 450,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1,
            bgcolor: theme.palette.action.hover,
          }}
        >
          <Stack spacing={2} alignItems="center">
            <TrendingUpIcon
              sx={{
                fontSize: 48,
                color: theme.palette.text.secondary,
              }}
            />
            <Typography color="text.secondary">
              Please select a pen to view live sensor data
            </Typography>
          </Stack>
        </Box>
      ) : (
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
              isAnimationActive={false}
              type="monotone"
              dataKey="value"
              stroke={
                selectedMetricData.color === "error"
                  ? theme.palette.error.main
                  : theme.palette.primary.main
              }
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default LiveChart;
