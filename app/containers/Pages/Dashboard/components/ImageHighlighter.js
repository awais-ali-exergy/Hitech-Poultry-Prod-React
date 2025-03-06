import React, { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import { keyframes } from "@mui/system";
import test from "../../../../../public/test.jpg";

const ImageHighlight = () => {
  const [dots, setDots] = useState([]);
  const [currentCoords, setCurrentCoords] = useState({
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
  });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const pulseAnimation = keyframes`
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.7;
    }
    50% {
      transform: translate(-50%, -50%) scale(2.5);
      opacity: 0.3;
    }
    100% {
      transform: translate(-50%, -50%) scale(3);
      opacity: 0;
    }
  `;

  const calculatePercentage = (pixelValue, totalSize) => {
    return (pixelValue / totalSize) * 100;
  };

  const handleImageClick = (e) => {
    if (!imageRef.current || !containerRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = calculatePercentage(x, rect.width);
    const yPercent = calculatePercentage(y, rect.height);

    setDots([...dots, { x, y, xPercent, yPercent }]);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current || !containerRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = calculatePercentage(x, rect.width);
    const yPercent = calculatePercentage(y, rect.height);

    setCurrentCoords({ x, y, xPercent, yPercent });
  };

  const handleRemoveDot = (index) => {
    setDots(dots.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          width: "fit-content",
          border: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <img
          ref={imageRef}
          src={test}
          alt="Buildings"
          style={{
            display: "block",
            width: "500px",
            height: "auto",
          }}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
        />
        {dots.map((dot, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              left: dot.x - 4,
              top: dot.y - 4,
              pointerEvents: "none",
            }}
          >
            {/* Center dot */}
            <Box
              sx={{
                width: "8px",
                height: "8px",
                bgcolor: "error.main",
                borderRadius: "50%",
                position: "relative",
                zIndex: 2,
                boxShadow: 2,
              }}
            />
            {/* Single pulse ring */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "8px",
                height: "8px",
                bgcolor: "error.main",
                borderRadius: "50%",
                zIndex: 1,
                animation: `${pulseAnimation} 1.5s ease-out infinite`,
              }}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Current Mouse Position:
        </Typography>
        <Typography>
          Pixels: X: {Math.round(currentCoords.x)}, Y:{" "}
          {Math.round(currentCoords.y)}
        </Typography>
        <Typography>
          Percentage: X: {currentCoords.xPercent.toFixed(2)}%, Y:{" "}
          {currentCoords.yPercent.toFixed(2)}%
        </Typography>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Saved Coordinates:
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {dots.map((dot, index) => (
            <Box
              key={index}
              sx={{ pb: 1, borderBottom: 1, borderColor: "grey.200" }}
            >
              <Typography>
                Door {index + 1}:
                <br />
                Pixels: X: {Math.round(dot.x)}, Y: {Math.round(dot.y)}
                <br />
                Percentage: X: {dot.xPercent.toFixed(2)}%, Y:{" "}
                {dot.yPercent.toFixed(2)}%
              </Typography>
              <Button
                onClick={() => handleRemoveDot(index)}
                color="error"
                size="small"
                sx={{ mt: 0.5 }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ImageHighlight;
