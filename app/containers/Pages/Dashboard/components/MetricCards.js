import React from "react";
import { Box } from "@mui/material";
import MetricCard from "./MetricCard";

const MetricCards = ({ metrics, selectedMetric, onMetricSelect }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 3,
        mb: 4,
        width: "100%",
      }}
    >
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          metric={metric}
          selected={selectedMetric === metric.id}
          onClick={() => onMetricSelect(metric.id)}
        />
      ))}
    </Box>
  );
};

export default MetricCards;
