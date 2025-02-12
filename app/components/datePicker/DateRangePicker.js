import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
  Popover,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ManageSearch as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const DateRangePicker = ({
  dateRange,
  onDateRangeChange,
  onSearch,
  showHoursOption = true,
  showPresets = true,
  className,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoursInput, setHoursInput] = useState("");
  const [tempDateRange, setTempDateRange] = useState(dateRange);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTempDateRange(dateRange);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDateRangeSelect = (range) => {
    let start, end;
    const now = dayjs();

    switch (range) {
      case "last24":
        start = now.subtract(24, "hour");
        end = now;
        break;
      case "lastWeek":
        start = now.subtract(7, "day");
        end = now;
        break;
      case "lastMonth":
        start = now.subtract(1, "month");
        end = now;
        break;
      case "customHours":
        if (hoursInput && !isNaN(hoursInput)) {
          start = now.subtract(parseInt(hoursInput), "hour");
          end = now;
        }
        break;
      default:
        return;
    }

    if (start && end) {
      const newRange = { start, end };
      onDateRangeChange(newRange);
      onSearch(newRange);
      handleClose();
    }
  };

  const handleDateChange = (type) => (newValue) => {
    setTempDateRange((prev) => ({
      ...prev,
      [type]: newValue,
    }));
  };

  const handleApply = () => {
    onDateRangeChange(tempDateRange);
    onSearch(tempDateRange);
    handleClose();
  };

  const handleClear = () => {
    const newRange = { start: null, end: null };
    onDateRangeChange(newRange);
    handleClose();
  };

  const formatDateRange = () => {
    if (!dateRange.start || !dateRange.end) return "Select date range";

    const start = dayjs(dateRange.start);
    const end = dayjs(dateRange.end);

    if (start.isSame(end, "day")) {
      return `${start.format("MMM D, YYYY")} ${start.format("h:mm A")}`;
    }
    return `${start.format("MMM D, h:mm A")} - ${end.format(
      "MMM D, YYYY h:mm A"
    )}`;
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
            {showPresets && (
              <>
                <Button
                  onClick={() => handleDateRangeSelect("last24")}
                  variant="outlined"
                >
                  Last 24 Hours
                </Button>
                <Button
                  onClick={() => handleDateRangeSelect("lastWeek")}
                  variant="outlined"
                >
                  Last Week
                </Button>
                <Button
                  onClick={() => handleDateRangeSelect("lastMonth")}
                  variant="outlined"
                >
                  Last Month
                </Button>
              </>
            )}

            <Stack spacing={2}>
              <DateTimePicker
                label="Start Date & Time"
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
              <DateTimePicker
                label="End Date & Time"
                value={tempDateRange.end}
                onChange={handleDateChange("end")}
                minDateTime={tempDateRange.start}
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
                variant="contained"
                onClick={handleApply}
                disabled={!tempDateRange.start || !tempDateRange.end}
                fullWidth
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Popover>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
