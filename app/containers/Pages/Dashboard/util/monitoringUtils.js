import React from "react";
import {
  ThermostatAuto as TempIcon,
  WaterDrop as HumidityIcon,
  LightMode as LightIcon,
  Science as AmmoniaIcon,
} from "@mui/icons-material";

// Data formatting utilities
export const formatValue = (value, metric) => {
  switch (metric) {
    case "temperature":
      return `${value.toFixed(1)}°C`;
    case "humidity":
      return `${value.toFixed(1)}%`;
    case "light":
      return `${value.toFixed(1)} lux`;
    case "ammonia":
      return `${value.toFixed(1)} ppm`;
    default:
      return value.toString();
  }
};

// Data mapping configurations
export const dataKeyMap = {
  temperature: "temperature",
  humidity: "humidity",
  light: "lux",
  ammonia: "ammonia_ppm",
};

// Chart configurations
export const metricConfigs = {
  temperature: {
    domain: [15, 35],
    tickCount: 10,
    buffer: 2,
  },
  humidity: {
    domain: [40, 90],
    tickCount: 10,
    buffer: 5,
  },
  light: {
    domain: [0, 100],
    tickCount: 8,
    buffer: 20,
  },
  ammonia: {
    domain: [0, 50],
    tickCount: 10,
    buffer: 10,
  },
};

// Chart domain calculation
export const getDynamicDomain = (dataMin, dataMax, metric) => {
  const config = metricConfigs[metric];
  const [configMin, configMax] = config.domain;

  if (dataMin >= configMin && dataMax <= configMax) {
    return config.domain;
  }

  const actualMin = Math.floor(Math.min(dataMin, configMin) - config.buffer);
  const actualMax = Math.ceil(Math.max(dataMax, configMax) + config.buffer);

  return [actualMin, actualMax];
};

// Default values
export const defaultReadings = {
  temperature: "24.5°C",
  humidity: "65%",
  light: "80 lux",
  ammonia: "0 ppm",
};

// Metric definitions
export const getMetricDefinitions = (latestReadings) => [
  {
    id: "temperature",
    icon: <TempIcon />, // Now using the actual icon component
    label: "Temperature",
    value: latestReadings.temperature,
    color: "error",
    min: "20",
    max: "28",
  },
  {
    id: "humidity",
    icon: <HumidityIcon />,
    label: "Humidity",
    value: latestReadings.humidity,
    color: "primary",
    min: "55",
    max: "75",
  },
  {
    id: "light",
    icon: <LightIcon />,
    label: "Light",
    value: latestReadings.light,
    color: "warning",
    min: "50",
    max: "100",
  },
  {
    id: "ammonia",
    icon: <AmmoniaIcon />,
    label: "Ammonia",
    value: latestReadings.ammonia,
    color: "success",
    min: "10",
    max: "20",
  },
];
