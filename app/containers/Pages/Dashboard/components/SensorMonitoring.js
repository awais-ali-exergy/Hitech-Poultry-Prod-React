import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Stack, Button, Collapse } from "@mui/material";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(true);
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

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
        actions={alert.actions}
      />

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            Real-Time Sensor Readings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Live streaming data updates for temperature, humidity, light, and
            ammonia levels
          </Typography>
        </Box>
        <Button
          onClick={handleToggleExpand}
          size="small"
          variant="outlined"
          endIcon={
            <Box
              component="span"
              sx={{
                display: "flex",
                transition: "transform 0.2s",
                transform: isExpanded ? "rotate(0deg)" : "rotate(-180deg)",
              }}
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </Box>
          }
          sx={{
            minWidth: "100px",
            whiteSpace: "nowrap",
          }}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </Stack>

      <Collapse in={isExpanded}>
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
      </Collapse>
    </Box>
  );
};

export default SensorMonitoring;
