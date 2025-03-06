// PenPreviewTabs.js
import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Typography, Popper, Fade } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

const PenLocationPreview = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(1),
  borderBottom: "1px solid",
  borderColor: theme.palette.grey[200],
  "& .MuiTab-root": {
    textTransform: "none",
    height: "48px",
    minWidth: "120px",
    padding: theme.spacing(0, 3),
    boxSizing: "border-box",
    fontSize: "0.975rem",
    fontWeight: 500,
    color: theme.palette.text.secondary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&.Mui-selected": {
      color: theme.palette.primary.main,
      background: alpha(theme.palette.primary.main, 0.04),
      borderColor: theme.palette.grey[200],
    },
    "&:hover": {
      background: alpha(theme.palette.primary.main, 0.04),
      color: theme.palette.primary.main,
    },
  },
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: 1.5,
    bottom: 0,
  },
}));

const PenPreviewTabs = ({
  pens = [],
  currentPenIndex = 0,
  onPenChange,
  farmLayoutImage = "/api/placeholder/300/200", // Default placeholder image
}) => {
  const [previewAnchorEl, setPreviewAnchorEl] = useState(null);
  const [hoveredPen, setHoveredPen] = useState(null);

  const handlePenMouseEnter = (event, pen) => {
    setPreviewAnchorEl(event.currentTarget);
    setHoveredPen(pen);
  };

  const handlePenMouseLeave = () => {
    setPreviewAnchorEl(null);
    setHoveredPen(null);
  };

  const previewOpen = Boolean(previewAnchorEl);

  return (
    <Box position="relative">
      <StyledTabs value={currentPenIndex} onChange={onPenChange}>
        {pens.map((pen) => (
          <Tab
            key={pen.id}
            label={pen.penName}
            onMouseEnter={(e) => handlePenMouseEnter(e, pen)}
            onMouseLeave={handlePenMouseLeave}
          />
        ))}
      </StyledTabs>

      {/* Pen Location Preview Popper */}
      <Popper
        open={previewOpen}
        anchorEl={previewAnchorEl}
        placement="bottom-start"
        transition
        sx={{ zIndex: 1200 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <PenLocationPreview>
              <Typography variant="subtitle2" gutterBottom>
                {hoveredPen?.penName} Location
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 400,
                  backgroundColor: "grey.100",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <img
                  src={farmLayoutImage}
                  alt="Farm Layout"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Pen location highlight */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "30%",
                    left: "40%",
                    width: 48,
                    height: 48,
                    border: "2px solid",
                    borderColor: "primary.main",
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.2),
                    borderRadius: 1,
                  }}
                />
              </Box>
            </PenLocationPreview>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default PenPreviewTabs;
