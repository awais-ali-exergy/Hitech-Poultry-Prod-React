import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Circle,
  Activity,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectLiveReadings } from "../../../../redux/modules/farmSlice";
import dayjs from "dayjs";

const ENVIRONMENTAL_THRESHOLDS = {
  temperature: { min: 20, max: 25 },
  humidity: { min: 60, max: 80 },
  ammonia: { min: 0, max: 0.5 },
};

const calculateEnvironmentalScore = (readings, metricData) => {
  if (!readings || readings.length === 0) return null;

  const scores = {
    temperature: [],
    humidity: [],
    ammonia: [],
  };

  readings.forEach((reading) => {
    if (reading.avgTemperature) {
      const tempRange = metricData.temperature.max - metricData.temperature.min;
      const tempDev = Math.abs(
        reading.avgTemperature -
          (metricData.temperature.max + metricData.temperature.min) / 2
      );
      scores.temperature.push(Math.max(0, 100 - (tempDev / tempRange) * 100));
    }

    if (reading.avgHumidity) {
      const humRange = metricData.humidity.max - metricData.humidity.min;
      const humDev = Math.abs(
        reading.avgHumidity -
          (metricData.humidity.max + metricData.humidity.min) / 2
      );
      scores.humidity.push(Math.max(0, 100 - (humDev / humRange) * 100));
    }

    if (reading.avgAmmonia) {
      const ammScore =
        reading.avgAmmonia <= metricData.ammonia.max
          ? 100 - (reading.avgAmmonia / metricData.ammonia.max) * 50
          : Math.max(
              0,
              50 - (reading.avgAmmonia - metricData.ammonia.max) * 20
            );
      scores.ammonia.push(ammScore);
    }
  });

  const avgScores = {
    temperature: scores.temperature.length
      ? scores.temperature.reduce((a, b) => a + b, 0) /
        scores.temperature.length
      : null,
    humidity: scores.humidity.length
      ? scores.humidity.reduce((a, b) => a + b, 0) / scores.humidity.length
      : null,
    ammonia: scores.ammonia.length
      ? scores.ammonia.reduce((a, b) => a + b, 0) / scores.ammonia.length
      : null,
  };

  const weights = { temperature: 0.4, humidity: 0.4, ammonia: 0.2 };
  let totalWeight = 0;
  let weightedScore = 0;

  Object.entries(avgScores).forEach(([metric, score]) => {
    if (score !== null) {
      weightedScore += score * weights[metric];
      totalWeight += weights[metric];
    }
  });

  const overallScore =
    totalWeight > 0 ? Math.round(weightedScore / totalWeight) : null;

  return {
    overall: overallScore,
    factors: {
      temperature: avgScores.temperature
        ? Math.round(avgScores.temperature)
        : null,
      humidity: avgScores.humidity ? Math.round(avgScores.humidity) : null,
      ammonia: avgScores.ammonia ? Math.round(avgScores.ammonia) : null,
    },
  };
};

const getScoreStatus = (score) => {
  if (score === null) return "unknown";
  if (score >= 80) return "good";
  if (score >= 60) return "warning";
  return "critical";
};

const SensorContext = ({
  selectedPen,
  selectedMetric,
  selectedMetricData,
  fetchSensorReadings,
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const dispatch = useDispatch();
  const liveReadings = useSelector(selectLiveReadings);
  const [sensorData, setSensorData] = useState(null);
  const [stats, setStats] = useState({ max: null, min: null, avg: null });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [environmentalScore, setEnvironmentalScore] = useState(null);

  useEffect(() => {
    if (selectedPen?.deviceId) {
      setRecentEvents([
        {
          type: "info",
          message: `Started monitoring ${selectedPen.penName}`,
          time: dayjs().format("HH:mm:ss"),
          icon: Activity,
        },
      ]);
    }
  }, [selectedPen?.deviceId, selectedPen?.penName]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchSensorData = async () => {
      if (!selectedPen?.deviceId) return;

      setLoading(true);
      try {
        const response = await dispatch(
          fetchSensorReadings({
            deviceId: selectedPen.deviceId,
            timePeriod: "TODAY",
            signal: abortController.signal,
          })
        ).unwrap();

        setSensorData(response.data);

        const score = calculateEnvironmentalScore(
          response.data,
          ENVIRONMENTAL_THRESHOLDS
        );
        setEnvironmentalScore(score);
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching sensor data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
    return () => abortController.abort();
  }, [selectedPen?.deviceId, dispatch, fetchSensorReadings]);

  useEffect(() => {
    if (!sensorData || sensorData.length === 0.0) return;

    const values = sensorData.map((reading) => {
      switch (selectedMetric) {
        case "temperature":
          return reading.avgTemperature;
        case "humidity":
          return reading.avgHumidity;
        case "light":
          return reading.avgLux;
        case "ammonia":
          return reading.avgAmmonia;
        default:
          return 0;
      }
    });

    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    const maxReading = sensorData.find((r) => {
      switch (selectedMetric) {
        case "temperature":
          return r.avgTemperature === max;
        case "humidity":
          return r.avgHumidity === max;
        case "light":
          return r.avgLux === max;
        case "ammonia":
          return r.avgAmmonia === max;
        default:
          return false;
      }
    });

    const minReading = sensorData.find((r) => {
      switch (selectedMetric) {
        case "temperature":
          return r.avgTemperature === min;
        case "humidity":
          return r.avgHumidity === min;
        case "light":
          return r.avgLux === min;
        case "ammonia":
          return r.avgAmmonia === min;
        default:
          return false;
      }
    });

    setStats({
      max: {
        value: max.toFixed(2),
        time: dayjs(maxReading.timeRangeStart).format("HH:mm"),
      },
      min: {
        value: min.toFixed(2),
        time: dayjs(minReading.timeRangeStart).format("HH:mm"),
      },
      avg: avg.toFixed(2),
    });
  }, [sensorData, selectedMetric]);

  useEffect(() => {
    if (!liveReadings.history?.length) return;

    const events = [];
    const lastReading = liveReadings.history[liveReadings.history.length - 1];
    const value = lastReading.value;

    if (
      selectedMetric === "temperature" &&
      value.temperature > parseFloat(selectedMetricData.max)
    ) {
      events.push({
        type: "error",
        message: `Temperature exceeded ${selectedMetricData.max}°C`,
        time: lastReading.time,
      });
    }

    if (
      selectedMetric === "humidity" &&
      value.humidity > parseFloat(selectedMetricData.max)
    ) {
      events.push({
        type: "error",
        message: `Humidity exceeded ${selectedMetricData.max}%`,
        time: lastReading.time,
      });
    }

    if (
      selectedMetric === "ammonia" &&
      value.ammonia_ppm > parseFloat(selectedMetricData.max)
    ) {
      events.push({
        type: "error",
        message: `Ammonia exceeded ${selectedMetricData.max}ppm`,
        time: lastReading.time,
      });
    }

    setRecentEvents((prevEvents) => [...events, ...prevEvents].slice(0, 4));
  }, [liveReadings.history, selectedMetric, selectedMetricData.max]);

  const getStatusColor = useCallback(
    (status) => {
      switch (status) {
        case "good":
          return theme.palette.success.main;
        case "warning":
          return theme.palette.warning.main;
        case "critical":
          return theme.palette.error.main;
        default:
          return theme.palette.text.secondary;
      }
    },
    [theme.palette]
  );
  const renderCardContent = useCallback(
    (title, content) => (
      <>
        <Box sx={{ pb: 2, mb: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              fontSize: "0.875rem",
              letterSpacing: "0.1px",
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
        </Box>
        {content}
      </>
    ),
    []
  );

  return (
    <Stack
      direction={isTablet ? "row" : "column"}
      spacing={2}
      sx={{ width: "100%", flexWrap: isTablet ? "wrap" : "nowrap" }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          flex: isTablet ? "1 1 calc(33% - 16px)" : 1,
          minWidth: isTablet ? "250px" : "auto",
        }}
      >
        {renderCardContent(
          "24h Statistics",
          loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Maximum
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TrendingUp
                    size={16}
                    color={theme.palette.error.main}
                    strokeWidth={2.5}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stats.max?.value || "-"}
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 0.5 }}
                    >
                      {selectedMetricData.unit}
                    </Typography>
                  </Typography>
                  {stats.max?.time && (
                    <Typography variant="caption" color="text.secondary">
                      at {stats.max.time}
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Minimum
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TrendingDown
                    size={16}
                    color={theme.palette.primary.main}
                    strokeWidth={2.5}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stats.min?.value || "-"}
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 0.5 }}
                    >
                      {selectedMetricData.unit}
                    </Typography>
                  </Typography>
                  {stats.min?.time && (
                    <Typography variant="caption" color="text.secondary">
                      at {stats.min.time}
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Average
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stats.avg || "-"}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 0.5 }}
                  >
                    {selectedMetricData.unit}
                  </Typography>
                </Typography>
              </Box>
            </Stack>
          )
        )}
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          flex: isTablet ? "1 1 calc(33% - 16px)" : 1,
          minWidth: isTablet ? "250px" : "auto",
        }}
      >
        {renderCardContent(
          "Environmental Score",
          loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Stack spacing={3}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    bgcolor: "background.default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    mb: 1,
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {environmentalScore?.overall || "-"}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Overall Score
                </Typography>
              </Box>

              {environmentalScore?.factors &&
                Object.entries(environmentalScore.factors).map(
                  ([factor, score]) => {
                    const status = getScoreStatus(score);
                    return (
                      <Box key={factor} sx={{ width: "100%" }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 0.5 }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {factor}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: getStatusColor(status) }}
                          >
                            {score || "-"}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={score || 0}
                          sx={{
                            height: 6,
                            borderRadius: 1,
                            bgcolor: "background.default",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: getStatusColor(status),
                            },
                          }}
                        />
                      </Box>
                    );
                  }
                )}

              {environmentalScore && (
                <Box
                  sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}
                >
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <AlertCircle size={16} color={theme.palette.warning.main} />
                    <Typography variant="body2">
                      {Object.entries(environmentalScore.factors)
                        .filter(
                          ([_, score]) => getScoreStatus(score) !== "good"
                        )
                        .map(([factor]) => factor)
                        .join(" and ")}{" "}
                      {Object.entries(environmentalScore.factors).filter(
                        ([_, score]) => getScoreStatus(score) !== "good"
                      ).length === 1
                        ? "needs"
                        : "need"}{" "}
                      attention
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          )
        )}
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          flex: isTablet ? "1 1 calc(33% - 16px)" : 1,
          minWidth: isTablet ? "250px" : "auto",
        }}
      >
        {renderCardContent(
          "Recent Events",
          recentEvents.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No recent events
            </Typography>
          ) : (
            <Stack spacing={2}>
              {recentEvents.map((event, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  {event.icon ? (
                    <event.icon
                      size={14}
                      color={theme.palette.primary.main}
                      strokeWidth={2.5}
                    />
                  ) : (
                    <Circle
                      size={8}
                      color={
                        event.type === "error"
                          ? theme.palette.error.main
                          : theme.palette.warning.main
                      }
                      fill={
                        event.type === "error"
                          ? theme.palette.error.main
                          : theme.palette.warning.main
                      }
                    />
                  )}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, lineHeight: 1.3 }}
                    >
                      {event.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {event.time}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          )
        )}
      </Paper>
    </Stack>
  );
};

export default SensorContext;
