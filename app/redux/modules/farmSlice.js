import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";

// Thunks
export const fetchFarms = createAsyncThunk(
  "farms/fetchFarms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/farms");
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchSensorReadings = createAsyncThunk(
  "sensors/fetchReadings",
  async ({ hours, range, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/api/sensor-readings/by-duration",
        {
          params: {
            hours,
            range,
            startDate,
            endDate,
          },
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  locations: [],
  selectedLocation: {
    farm: null, // Will store complete farm object
    house: null, // Will store complete house object
    pen: null, // Will store complete pen object (if needed later)
  },
  loading: false,
  error: null,
};

const farmsSlice = createSlice({
  name: "farms",
  initialState,
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = {
        ...state.selectedLocation,
        ...action.payload,
      };
    },
    clearSelectedLocation: (state) => {
      state.selectedLocation = initialState.selectedLocation;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFarms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarms.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchFarms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedLocation, clearSelectedLocation } =
  farmsSlice.actions;
export default farmsSlice.reducer;

// Selectors
export const selectFarms = (state) => state.farms.locations;
export const selectSelectedLocation = (state) => state.farms.selectedLocation;
export const selectLoading = (state) => state.farms.loading;
export const selectError = (state) => state.farms.error;
