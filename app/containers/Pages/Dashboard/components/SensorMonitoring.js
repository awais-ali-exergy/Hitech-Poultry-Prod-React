import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { fetchSensorReadings } from "../../../../redux/modules/farmSlice";
import { useDispatch } from "react-redux";
import AlertMessage from "../../../../components/alertMessage/AlertMessage";
import {
  formatValue,
  dataKeyMap,
  getMetricDefinitions,
  defaultReadings,
} from "../util/monitoringUtils";
import MetricCards from "./MetricCards";
import HistoricalChart from "./HistoricalChart";
import LiveChart from "./LiveChart";

const SensorMonitoring = ({ selectedPen }) => {
  const [selectedMetric, setSelectedMetric] = useState("temperature");
  const [latestReadings, setLatestReadings] = useState(defaultReadings);
  const [alert, setAlert] = useState({
    open: false,
    severity: "info",
    message: "",
    actions: [],
  });
  const dispatch = useDispatch();

  const metrics = useMemo(
    () => getMetricDefinitions(latestReadings),
    [latestReadings]
  );

  const selectedMetricData = metrics.find((m) => m.id === selectedMetric);

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

      {selectedPen && (
        <MetricCards
          metrics={metrics}
          selectedMetric={selectedMetric}
          onMetricSelect={setSelectedMetric}
        />
      )}

      <Box
        sx={{
          display: "flex",
          gap: "24px",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <HistoricalChart
          deviceId={selectedPen?.deviceId}
          selectedMetric={selectedMetric}
          selectedMetricData={selectedMetricData}
          fetchSensorReadings={(params) =>
            dispatch(fetchSensorReadings(params)).unwrap()
          }
        />

        <LiveChart
          selectedPen={selectedPen}
          selectedMetric={selectedMetric}
          selectedMetricData={selectedMetricData}
          onLatestReadingsUpdate={setLatestReadings}
          onAlertChange={setAlert}
        />
      </Box>
    </Box>
  );
};

export default SensorMonitoring;
