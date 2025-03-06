import React, { useRef, useEffect } from "react";
import { Box, useTheme, Fab, Zoom } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { BASE_IMAGE, PEN_TO_SVG_MAP, SENSOR_POLYGONS } from "./farmLayoutUtils";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";

const FarmLayoutSVG = ({ selectedSensor, onSensorClick }) => {
  const theme = useTheme();
  const transformComponentRef = useRef(null);

  const goToSelectedSensor = () => {
    if (selectedSensor?.penName && transformComponentRef.current) {
      const sensorId = PEN_TO_SVG_MAP[selectedSensor.penName];
      const sensorElement = document.getElementById(sensorId);

      if (sensorElement && transformComponentRef.current) {
        const zoomUtils = transformComponentRef.current;
        if (typeof zoomUtils.zoomToElement === "function") {
          zoomUtils.zoomToElement(sensorElement, 2);
        } else if (typeof zoomUtils.setTransform === "function") {
          const bbox = sensorElement.getBBox();
          zoomUtils.setTransform(
            bbox.x + bbox.width / 2,
            bbox.y + bbox.height / 2,
            2,
            800
          );
        }
      }
    }
  };

  // Add useEffect to automatically zoom to selected sensor
  useEffect(() => {
    if (selectedSensor?.penName && transformComponentRef.current) {
      // Small delay to ensure the DOM is fully updated
      setTimeout(() => {
        goToSelectedSensor();
      }, 100);
    }
  }, [selectedSensor]); // Trigger whenever selectedSensor changes

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <style>
        {`
          @keyframes ping {
            0% {
              stroke-opacity: 1;
              stroke-width: 3;
              filter: drop-shadow(0 0 4px ${theme.palette.error.main});
              fill: rgba(255, 0, 0, 0.2);
            }
            50% {
              stroke-opacity: 0.8;
              stroke-width: 8;
              filter: drop-shadow(0 0 12px ${theme.palette.error.main});
              fill: rgba(255, 0, 0, 0.5);
            }
            100% {
              stroke-opacity: 1;
              stroke-width: 3;
              filter: drop-shadow(0 0 4px ${theme.palette.error.main});
              fill: rgba(255, 0, 0, 0.2);
            }
          }

          @keyframes glow {
            0% {
              filter: drop-shadow(0 0 5px ${theme.palette.error.main});
            }
            50% {
              filter: drop-shadow(0 0 15px ${theme.palette.error.main}) drop-shadow(0 0 20px ${theme.palette.error.light});
            }
            100% {
              filter: drop-shadow(0 0 5px ${theme.palette.error.main});
            }
          }
          
          .sensor-polygon {
            fill: rgba(255, 255, 255, 0.1);
            stroke: ${theme.palette.primary.main};
            stroke-width: 1;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .sensor-polygon:hover {
            fill: rgba(255, 255, 255, 0.3);
          }
          .sensor-polygon.selected {
            fill: rgba(255, 0, 0, 0.3);
            stroke: ${theme.palette.error.main};
            stroke-width: 3;
            stroke-dasharray: 10, 5;
            filter: drop-shadow(0 0 5px ${theme.palette.error.main});
            animation: ping 1.5s ease-in-out infinite, glow 3s ease-in-out infinite;
          }
          .transform-component-module_wrapper__1_Fgj {
            width: 100% !important;
          }
          .transform-component-module_content__2jYgh {
            width: 100% !important;
          }
        `}
      </style>

      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={4}
        centerOnInit={true}
        doubleClick={{ disabled: true }}
        onInit={(reactZoomPanPinchRef) => {
          transformComponentRef.current = reactZoomPanPinchRef;
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperStyle={{
                width: "100%",
              }}
              contentStyle={{
                width: "100%",
              }}
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 3002 2402"
                width="100%"
              >
                {/* Base Image Layer */}
                <g id="Layer_1">
                  <image
                    style={{ overflow: "visible" }}
                    width="100%"
                    href={BASE_IMAGE.base64}
                  />
                </g>

                {/* Sensor Polygons */}
                {SENSOR_POLYGONS.map((sensor) => (
                  <g
                    key={sensor.id}
                    id={sensor.id}
                    onClick={() => onSensorClick(sensor.id)}
                    className={`sensor-polygon ${
                      selectedSensor?.penName &&
                      PEN_TO_SVG_MAP[selectedSensor.penName] === sensor.id
                        ? "selected"
                        : ""
                    }`}
                  >
                    <polygon points={sensor.points} />
                  </g>
                ))}
              </svg>
            </TransformComponent>

            {/* Floating Control Buttons */}
            <Box
              sx={{
                position: "absolute",
                right: 16,
                bottom: 16,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                zIndex: 1000,
              }}
            >
              <Zoom in={true}>
                <Fab
                  size="small"
                  sx={{
                    bgcolor: "grey.500",
                    "&:hover": { bgcolor: "grey.600" },
                  }}
                  onClick={() => zoomIn()}
                  aria-label="zoom in"
                >
                  <ZoomInIcon sx={{ color: "white" }} />
                </Fab>
              </Zoom>

              <Zoom in={true} style={{ transitionDelay: "75ms" }}>
                <Fab
                  size="small"
                  sx={{
                    bgcolor: "grey.500",
                    "&:hover": { bgcolor: "grey.600" },
                  }}
                  onClick={() => zoomOut(0.5)}
                  aria-label="zoom out"
                >
                  <ZoomOutIcon sx={{ color: "white" }} />
                </Fab>
              </Zoom>

              <Zoom in={true} style={{ transitionDelay: "150ms" }}>
                <Fab
                  size="small"
                  sx={{
                    bgcolor: "grey.500",
                    "&:hover": { bgcolor: "grey.600" },
                  }}
                  onClick={() => resetTransform()}
                  aria-label="reset zoom"
                >
                  <CenterFocusWeakIcon sx={{ color: "white" }} />
                </Fab>
              </Zoom>

              {selectedSensor?.penName && (
                <Zoom in={true} style={{ transitionDelay: "225ms" }}>
                  <Fab
                    size="small"
                    color="error"
                    sx={{
                      "&:hover": { bgcolor: theme.palette.error.dark },
                    }}
                    onClick={goToSelectedSensor}
                    aria-label="go to selected sensor"
                  >
                    <MyLocationIcon sx={{ color: "white" }} />
                  </Fab>
                </Zoom>
              )}
            </Box>
          </>
        )}
      </TransformWrapper>
    </Box>
  );
};

export default FarmLayoutSVG;
