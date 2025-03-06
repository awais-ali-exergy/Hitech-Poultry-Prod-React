import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LightModeIcon from "@mui/icons-material/LightMode";
import AirIcon from "@mui/icons-material/Air";
import HistoricalChart from "./HistoricalChart";
import LiveChart from "./LiveChart";
import SensorContext from "./SensorContext";
import { fetchSensorReadings } from "../../../../redux/modules/farmSlice";

const metrics = [
  {
    id: "temperature",
    label: "Temperature",
    icon: ThermostatIcon,
    unit: "°C",
    max: 30,
    min: 20,
  },
  {
    id: "humidity",
    label: "Humidity",
    icon: WaterDropIcon,
    unit: "%",
    max: 80,
    min: 40,
  },
  {
    id: "light",
    label: "Light",
    icon: LightModeIcon,
    unit: "lux",
    max: 1000,
    min: 100,
  },
  {
    id: "ammonia",
    label: "Ammonia",
    icon: AirIcon,
    unit: "ppm",
    max: 15,
    min: 0,
  },
];

const SensorMonitoring = ({ selectedPen }) => {
  const [selectedMetric, setSelectedMetric] = useState("temperature");
  const selectedMetricData = metrics.find((m) => m.id === selectedMetric);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box sx={{ mt: 3 }}>
      <Stack
        direction={isTablet ? "column" : "row"}
        spacing={2}
        sx={{ width: "100%" }}
      >
        {/* Left side: Charts and Buttons */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 3,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            minWidth: 0,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedPen?.penName} - {selectedMetricData?.label}
          </Typography>

          {/* Metric Buttons */}
          <ButtonGroup
            variant="contained"
            disableElevation
            orientation={
              isTablet && theme.breakpoints.down("sm")
                ? "vertical"
                : "horizontal"
            }
            sx={{
              mb: 3,
              width: "100%",
              flexWrap: isTablet ? "wrap" : "nowrap",
              "& .MuiButton-root": {
                flex: isTablet ? "1 1 40%" : 1,
                py: 1.5,
                textTransform: "none",
                borderRadius: 1,
                whiteSpace: "nowrap",
              },
            }}
          >
            {metrics.map((metric) => {
              const MetricIcon = metric.icon;
              const isSelected = selectedMetric === metric.id;
              return (
                <Button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  color={isSelected ? "primary" : "inherit"}
                  sx={{
                    bgcolor: isSelected
                      ? "primary.main"
                      : theme.palette.action.hover, // This replaces "#f8f9fa"
                    color: isSelected
                      ? "primary.contrastText" // This ensures text is readable on primary color
                      : "text.primary", // This uses theme's text color
                    "&:hover": {
                      bgcolor: isSelected
                        ? "primary.dark"
                        : theme.palette.action.selected, // This replaces "#f0f0f0"
                    },
                    fontSize: isTablet ? "0.875rem" : "inherit",
                  }}
                  startIcon={<MetricIcon />}
                >
                  {metric.label}
                </Button>
              );
            })}
          </ButtonGroup>

          {/* Charts */}
          <Stack spacing={2}>
            <HistoricalChart
              selectedPen={selectedPen}
              selectedMetric={selectedMetric}
              selectedMetricData={selectedMetricData}
            />
            <LiveChart
              selectedPen={selectedPen}
              selectedMetric={selectedMetric}
              selectedMetricData={selectedMetricData}
            />
          </Stack>
        </Paper>

        {/* Right side: Context */}
        <Box
          sx={{
            width: isTablet ? "100%" : 280,
            display: isTablet ? "flex" : "block",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <SensorContext
            selectedPen={selectedPen}
            selectedMetric={selectedMetric}
            selectedMetricData={selectedMetricData}
            fetchSensorReadings={fetchSensorReadings}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default SensorMonitoring;
