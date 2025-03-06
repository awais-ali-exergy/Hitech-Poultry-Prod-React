import React, { useState, useEffect, useMemo } from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  alpha,
  Tooltip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LightModeIcon from "@mui/icons-material/LightMode";
import AirIcon from "@mui/icons-material/Air";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { WebSocketService } from "../../../../utils/websocketService";
import { formatValue } from "../util/monitoringUtils";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { updateLiveReadings } from "../../../../redux/modules/farmSlice";

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

const MetricDisplay = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const LiveSensorRow = ({ pen, isSelected, onClick }) => {
  const [readings, setReadings] = useState({
    temperature: "-",
    humidity: "-",
    light: "-",
    ammonia: "-",
  });
  const [wsStatus, setWsStatus] = useState("Connecting...");
  const [isAlerting, setIsAlerting] = useState(false);
  const dispatch = useDispatch();
  const [latestValue, setLatestValue] = useState(null);
  const wsService = useMemo(() => new WebSocketService(), []);

  useEffect(() => {
    if (!pen?.deviceId) return;

    const topic = `/topic/house/${pen.deviceId}`;

    const handleMessage = ({ type, value }) => {
      if (type === "status") {
        setWsStatus(value);
      } else if (type === "data") {
        const newReadings = {
          temperature: formatValue(value.temperature, "temperature"),
          humidity: formatValue(value.humidity, "humidity"),
          light: formatValue(value.lux, "light"),
          ammonia: formatValue(value.ammonia_ppm, "ammonia"),
        };

        setIsAlerting(
          parseFloat(newReadings.temperature) > 30 ||
            parseFloat(newReadings.humidity) > 80 ||
            parseFloat(newReadings.ammonia) > 15
        );

        setReadings(newReadings);
        setLatestValue(value);
      }
    };

    wsService.connect(topic, handleMessage);
    return () => wsService.disconnect();
  }, [pen?.deviceId, wsService]);

  useEffect(() => {
    if (isSelected && latestValue) {
      dispatch(
        updateLiveReadings({
          ...readings,
          deviceId: pen.deviceId,
          penName: pen.penName,
          time: dayjs().format("HH:mm:ss"),
          value: latestValue,
        })
      );
    }
  }, [
    isSelected,
    latestValue,
    readings,
    pen?.deviceId,
    pen?.penName,
    dispatch,
  ]);

  const getMetricIconStyles = (value, type) => {
    let color;
    if (value === "-") {
      color = "primary";
    } else {
      const numValue = parseFloat(value);
      switch (type) {
        case "temperature":
          color = numValue > 30 ? "error" : "success";
          break;
        case "humidity":
          color = numValue > 80 ? "error" : "info";
          break;
        case "ammonia":
          color = numValue > 15 ? "error" : "success";
          break;
        default:
          color = "primary";
      }
    }
    return { color };
  };

  return (
    <TableRow
      onClick={onClick}
      sx={{
        cursor: "pointer",
        bgcolor: isSelected
          ? (theme) => alpha(theme.palette.primary.main, 0.04)
          : "background.paper",
        "&:hover": {
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
        },
        transition: "background-color 0.2s",
      }}
    >
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {wsStatus === "Connected" && <LiveIndicator />}
          <Typography fontWeight={500}>{pen.penName}</Typography>
          {isAlerting && (
            <Tooltip title="Alert: One or more metrics exceeding threshold">
              <WarningAmberIcon
                sx={{
                  ml: 1,
                  color: "error.main",
                  animation: "pulse 2s infinite",
                }}
              />
            </Tooltip>
          )}
        </Box>
      </TableCell>

      <TableCell>
        <MetricDisplay>
          <Tooltip title="Temperature">
            <IconButton
              size="small"
              sx={{
                p: 1,
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <ThermostatIcon
                {...getMetricIconStyles(readings.temperature, "temperature")}
              />
            </IconButton>
          </Tooltip>
          <Typography>{readings.temperature}</Typography>
        </MetricDisplay>
      </TableCell>

      <TableCell>
        <MetricDisplay>
          <Tooltip title="Humidity">
            <IconButton
              size="small"
              sx={{
                p: 1,
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <WaterDropIcon
                {...getMetricIconStyles(readings.humidity, "humidity")}
              />
            </IconButton>
          </Tooltip>
          <Typography>{readings.humidity}</Typography>
        </MetricDisplay>
      </TableCell>

      <TableCell>
        <MetricDisplay>
          <Tooltip title="Light">
            <IconButton
              size="small"
              sx={{
                p: 1,
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <LightModeIcon color="warning" />
            </IconButton>
          </Tooltip>
          <Typography>{readings.light}</Typography>
        </MetricDisplay>
      </TableCell>

      <TableCell>
        <MetricDisplay>
          <Tooltip title="Ammonia">
            <IconButton
              size="small"
              sx={{
                p: 1,
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <AirIcon {...getMetricIconStyles(readings.ammonia, "ammonia")} />
            </IconButton>
          </Tooltip>
          <Typography>{readings.ammonia}</Typography>
        </MetricDisplay>
      </TableCell>
    </TableRow>
  );
};

export default LiveSensorRow;
