import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Menu,
  Grid,
  MenuItem,
  alpha,
  Chip,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import {
  fetchFarms,
  selectFarms,
  selectSelectedLocation,
  setSelectedLocation,
} from "../../../redux/modules/farmSlice";

const LocationHeader = () => {
  const dispatch = useDispatch();
  const farms = useSelector(selectFarms);
  const selectedLoc = useSelector(selectSelectedLocation);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(fetchFarms());
  }, [dispatch]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (farm, house) => {
    dispatch(
      setSelectedLocation({
        farm,
        house,
        pen: null,
      })
    );
    handleClose();
  };

  const getCurrentLocation = () => {
    if (!selectedLoc.farm) return "Select Location";
    return `${selectedLoc.farm.farmName} / ${
      selectedLoc.house?.houseName || "Select House"
    }`;
  };

  const activeFarms = farms;

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        mb: 2,
        overflow: "hidden",
      }}
    >
      <Box
        onClick={handleClick}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: "primary.main",
          }}
        >
          <LocationIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
            >
              Current Location
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography color="primary.main" fontWeight={600}>
                {getCurrentLocation()}
              </Typography>
              <ExpandMoreIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Click to change location
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: "50%",
            maxWidth: "none",
            mt: 1,
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <Grid container spacing={4} sx={{ p: 3 }}>
          {activeFarms.map((farm) => (
            <Grid item xs={4} key={farm.id}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Box sx={{ color: "primary.main" }}>
                  <BusinessIcon />
                </Box>
                <Typography variant="h6" color="primary.main" fontWeight={600}>
                  {farm.farmName}
                </Typography>
              </Box>
              {farm.houses.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    gap: .5,
                    position: "sticky",
                    top: "200px",
                    mb: "auto",
                  }}
                >
                  {farm.houses.map((house) => {
                    return (
                      house.pens.length > 0 && (
                        <MenuItem
                          key={house.id}
                          onClick={() => handleSelect(farm, house)}
                          sx={{
                            borderRadius: 1,
                            py: 1,
                            px: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.08),
                            },
                            ...(selectedLoc.farm?.id === farm.id &&
                              selectedLoc.house?.id === house.id && {
                                bgcolor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.08),
                                color: "primary.main",
                                fontWeight: 500,
                              }),
                          }}
                        >
                          <Typography>{house.houseName}</Typography>
                          <Chip
                            label={`${house.pens.length} Pens`}
                            size="small"
                            sx={{
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.08),
                              color: "primary.main",
                              fontWeight: 500,
                              "& .MuiChip-label": {
                                px: 1,
                              },
                            }}
                          />
                        </MenuItem>
                      )
                    );
                  })}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: "auto",
                    px: 2,
                    py: 1,
                    fontStyle: "italic",
                  }}
                >
                  No houses available
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </Menu>
    </Paper>
  );
};

export default LocationHeader;