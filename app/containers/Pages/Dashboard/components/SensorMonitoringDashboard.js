import React from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  useTheme,
  Stack,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LiveSensorRow from "./LiveSensorRow";
import test from "../../../../../public/test2.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLiveReadings,
  selectSelectedSensor,
  setSelectedSensor,
} from "../../../../redux/modules/farmSlice";
import FarmLayoutSVG from "./farmlayout/FarmLayout";

const SensorMonitoringDashboard = ({ pens = [] }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const selectedSensor = useSelector(selectSelectedSensor);

  const handleSensorSelect = (pen) => {
    dispatch(
      setSelectedSensor({
        id: pen.deviceId,
        penName: pen.penName,
        deviceId: pen.deviceId,
        // Add any other sensor data you need
      })
    );
  };

  if (!pens.length) {
    return (
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
            No pens available for monitoring
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Farm Layout Section */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: 1,
              borderColor: theme.palette.divider,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Farm Layout
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Visual representation of farm structure and sensor placement
              </Typography>
            </Box>
            {/* Add your farm layout visualization here */}
            <FarmLayoutSVG
              selectedSensor={selectedSensor}
              onSensorClick={handleSensorSelect}
            />
          </Paper>
        </Grid>

        {/* Sensors Table Section */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: 1,
              borderColor: theme.palette.divider,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Sensor Readings
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Real-time environmental data from active sensors
              </Typography>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pen</TableCell>
                  <TableCell>Temperature</TableCell>
                  <TableCell>Humidity</TableCell>
                  <TableCell>Light</TableCell>
                  <TableCell>Ammonia</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pens.map((pen) => (
                  <LiveSensorRow
                    key={pen.deviceId}
                    pen={pen}
                    isSelected={selectedSensor?.id === pen.deviceId}
                    onClick={() => handleSensorSelect(pen)}
                  />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SensorMonitoringDashboard;
