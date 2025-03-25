import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  Tab,
  Tabs,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  IconButton,
  alpha,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LocationHeader from "./LocationHeader";
import {
  selectSelectedLocation,
  selectSelectedSensor,
  setSelectedLocation,
} from "../../../redux/modules/farmSlice";
import { useDispatch, useSelector } from "react-redux";
import DashboardCharts from "./components/DashboardCharts";
import ImageHighlight from "./components/ImageHighlighter";
import PenPreviewTabs from "./components/PenPreviewTabs";
import test from "../../../../public/test.jpg";
import SensorMonitoringTable from "./components/SensorMonitoringTable";
import SensorMonitoring from "./components/SensorMonitoring";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: "inline-flex",
  gap: "8px",
  border: "none",
  "& .MuiToggleButtonGroup-grouped": {
    flex: 1,
    border: "none !important",
    margin: 0,
    "&:not(:first-of-type)": {
      borderRadius: "24px",
    },
    "&:first-of-type": {
      borderRadius: "24px",
    },
  },
}));

const ViewToggleButton = styled(ToggleButton)(({ theme }) => ({
  padding: "8px 24px",
  border: "none",
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
    fontWeight: 500,
  },
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const selectedLocation = useSelector(selectSelectedLocation);
  const [selectedView, setSelectedView] = useState("KPI");
  const selectedSensor = useSelector(selectSelectedSensor);
  // Get pens from selected house
  const pens = selectedLocation.house?.pens || [];

  const handlePenChange = (event, newValue) => {
    const selectedPen = pens[newValue];
    if (selectedPen) {
      dispatch(
        setSelectedLocation({
          ...selectedLocation,
          pen: selectedPen,
        })
      );
    }
  };

  const handleViewChange = (event, newValue) => {
    if (newValue !== null) {
      setSelectedView(newValue);
    }
  };

  // Get the current pen index for Tabs value
  const currentPenIndex = selectedLocation.pen
    ? pens.findIndex((p) => p.id === selectedLocation.pen.id)
    : 0;

  return (
    <Box sx={{ p: 0, minHeight: "100vh" }}>
      <LocationHeader />
      <SensorMonitoringTable pens={pens} />
      <SensorMonitoring selectedPen={selectedSensor} />

      {/* <ImageHighlight /> */}
      <Box mt={3}>
        {selectedLocation.house ? (
          <PenPreviewTabs
            pens={pens}
            currentPenIndex={currentPenIndex}
            onPenChange={handlePenChange}
            farmLayoutImage={test}
          />
        ) : (
          <Box sx={{ mb: 2, p: 2 }}>
            <Typography color="text.secondary">
              Please select a location to view pens
            </Typography>
          </Box>
        )}
      </Box>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Performance Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and analyze key metrics including feed consumption, body
            weight, and light hours
          </Typography>
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <StyledToggleButtonGroup
            value={selectedView}
            exclusive
            onChange={handleViewChange}
          >
            {["KPI", "Mortality", "Egg Production"].map((view) => (
              <ViewToggleButton key={view} value={view}>
                {view}
              </ViewToggleButton>
            ))}
          </StyledToggleButtonGroup>

          <Select value={24} size="small">
            <MenuItem value={24}>Last 24 Hours</MenuItem>
            <MenuItem value={48}>Last 48 Hours</MenuItem>
            <MenuItem value={72}>Last 72 Hours</MenuItem>
          </Select>
        </Box>

        <DashboardCharts />
      </Paper>
    </Box>
  );
};

export default Dashboard;
