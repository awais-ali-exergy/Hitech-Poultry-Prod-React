import React from "react";
import { Box, Paper, Typography, Stack, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledMetricCard = styled(Paper)(({ theme, selected, color }) => ({
  padding: theme.spacing(1.5),
  paddingTop: 10,
  paddingBottom: 10,
  border: `1px solid ${
    selected ? theme.palette[color].main : theme.palette.grey[200]
  }`,
  borderRadius: 22,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    borderColor: theme.palette[color].main,
    boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.15)}`,
    "&::after": {
      opacity: 0.1,
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, ${theme.palette[color].main}, transparent)`,
    opacity: selected ? 0.05 : 0,
    transition: "opacity 0.2s ease-in-out",
  },
  ...(selected && {
    boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.15)}`,
  }),
}));

const MetricCard = ({ metric, selected, onClick }) => (
  <StyledMetricCard
    elevation={0}
    selected={selected}
    color={metric.color}
    onClick={onClick}
  >
    <Box
      sx={{
        bgcolor: (theme) => alpha(theme.palette[metric.color].main, 0.12),
        borderRadius: "50%",
        p: 1,
        display: "flex",
        alignItems: "center",
        zIndex: 1,
      }}
    >
      <Box sx={{ color: `${metric.color}.main` }}>{metric.icon}</Box>
    </Box>
    <Stack sx={{ zIndex: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {metric.label}
      </Typography>
      <Typography
        fontSize="1.5rem"
        color={`${metric.color}.main`}
        fontWeight={500}
      >
        {metric.value}
      </Typography>
      {selected && (
        <Typography variant="caption" color="text.secondary">
          Range: {metric.min} - {metric.max}
        </Typography>
      )}
    </Stack>
  </StyledMetricCard>
);

export default MetricCard;
