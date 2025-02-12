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
  setSelectedLocation,
} from "../../../redux/modules/farmSlice";
import { useDispatch, useSelector } from "react-redux";
import LiveMonitoring from "./components/LiveMonitoring";
import DashboardCharts from "./components/DashboardCharts";

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
      <Box>
        {selectedLocation.house ? (
          <Tabs
            sx={{
              mb: 0,
              pl: 1,
              "& .MuiTab-root": {
                textTransform: "none",
                minHeight: "48px",
                minWidth: "120px", // Add minimum width
                px: 3, // Add horizontal padding
                border: "1px solid",
                borderColor: "grey.200",
                borderBottom: "none",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                mr: 1,
                fontSize: "0.975rem",
                fontWeight: 500,
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "primary.main",
                  fontWeight: 600,
                  background: (theme) =>
                    alpha(theme.palette.primary.main, 0.04),
                  borderColor: "grey.200",
                },
                "&:hover": {
                  background: (theme) =>
                    alpha(theme.palette.primary.main, 0.04),
                  color: "primary.main",
                },
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              },
            }}
            value={currentPenIndex}
            onChange={handlePenChange}
          >
            {pens.map((pen) => (
              <Tab key={pen.id} label={pen.penName} />
            ))}
          </Tabs>
        ) : (
          <Box sx={{ mb: 2, p: 2 }}>
            <Typography color="text.secondary">
              Please select a location to view pens
            </Typography>
          </Box>
        )}
      </Box>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <LiveMonitoring />
      </Paper>

      {/* Combined Data View and Charts Container */}
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
