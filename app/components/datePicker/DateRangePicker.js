import React, { useState } from "react";
import { Box, Button, Stack, Popover, TextField } from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DateRangePicker = ({ dateRange, onDateRangeChange, onSearch }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempDateRange, setTempDateRange] = useState(dateRange);
  const [selectedPeriod, setSelectedPeriod] = useState("TODAY"); // Track selected period

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTempDateRange(dateRange);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDateRangeSelect = (range) => {
    setSelectedPeriod(range);
    const searchParams = {
      isPreset: true,
      timePeriod: range,
    };
    onSearch(searchParams);
    handleClose();
  };

  const handleDateChange = (type) => (newValue) => {
    setTempDateRange((prev) => ({
      ...prev,
      [type]: newValue,
    }));
    setSelectedPeriod("RANGE"); // Set to custom range when dates are modified
  };

  const handleApply = () => {
    setSelectedPeriod("RANGE");
    onDateRangeChange(tempDateRange);
    onSearch({
      isPreset: false,
      start: tempDateRange.start,
      end: tempDateRange.end,
    });
    handleClose();
  };

  const handleClear = () => {
    const newRange = { start: null, end: null };
    setSelectedPeriod(null);
    onDateRangeChange(newRange);
    handleClose();
  };

  const formatDateRange = () => {
    if (!dateRange.start || !dateRange.end) return "Select date range";

    if (selectedPeriod === "TODAY") return "Today";
    if (selectedPeriod === "THIS_WEEK") return "This Week";
    if (selectedPeriod === "LAST_WEEK") return "Last Week";

    const start = dayjs(dateRange.start);
    const end = dayjs(dateRange.end);
    return `${start.format("MMM D, YYYY")} - ${end.format("MMM D, YYYY")}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={
            <ArrowDropDownIcon
              sx={{
                transform: open ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            />
          }
          startIcon={<CalendarIcon />}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {formatDateRange()}
        </Button>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              width: "23rem",
              p: 3,
            },
          }}
        >
          <Stack spacing={2}>
            <Button
              onClick={() => handleDateRangeSelect("TODAY")}
              variant={selectedPeriod === "TODAY" ? "contained" : "outlined"}
            >
              Today
            </Button>
            <Button
              onClick={() => handleDateRangeSelect("THIS_WEEK")}
              variant={
                selectedPeriod === "THIS_WEEK" ? "contained" : "outlined"
              }
            >
              This Week
            </Button>
            <Button
              onClick={() => handleDateRangeSelect("LAST_WEEK")}
              variant={
                selectedPeriod === "LAST_WEEK" ? "contained" : "outlined"
              }
            >
              Last Week
            </Button>

            <Stack spacing={2}>
              <DatePicker
                label="Start Date"
                value={tempDateRange.start}
                onChange={handleDateChange("start")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      svg: { color: "primary.main", fontSize: "1.5rem" },
                      input: { color: "" },
                    }}
                    size="small"
                  />
                )}
              />
              <DatePicker
                label="End Date"
                value={tempDateRange.end}
                onChange={handleDateChange("end")}
                minDate={tempDateRange.start}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      svg: { color: "primary.main", fontSize: "1.5rem" },
                      input: { color: "" },
                    }}
                    size="small"
                  />
                )}
              />
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleClear}
                startIcon={<ClearIcon />}
                fullWidth
                sx={{
                  color: "primary.main",
                  borderColor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                  },
                }}
              >
                Clear
              </Button>
              <Button
                size="small"
                variant={selectedPeriod === "RANGE" ? "contained" : "outlined"}
                onClick={handleApply}
                disabled={!tempDateRange.start || !tempDateRange.end}
                fullWidth
              >
                Apply Range
              </Button>
            </Stack>
          </Stack>
        </Popover>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
