import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

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
  farmLayoutImage = "/api/placeholder/300/200",
}) => {
  return (
    <Box position="relative">
      <StyledTabs value={currentPenIndex} onChange={onPenChange}>
        {pens.map((pen) => (
          <Tab key={pen.id} label={pen.penName} />
        ))}
      </StyledTabs>
    </Box>
  );
};

export default PenPreviewTabs;
