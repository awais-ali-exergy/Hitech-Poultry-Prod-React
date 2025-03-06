import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";

export const fetchFarms = createAsyncThunk(
  "farms/fetchFarms",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.user.token;
      const companyId = state.user.user?.companyId;
      if (!token || !companyId) {
        throw new Error("Authentication required");
      }

      const response = await axiosInstance.get(`/api/farms/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSensorReadings = createAsyncThunk(
  "sensors/fetchReadings",
  async (
    { timePeriod, startDate, endDate, deviceId, signal },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState();
      const token = state.user.token;

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axiosInstance.get(
        "/api/sensor-readings/by-duration",
        {
          params: {
            timePeriod,
            startDate,
            endDate,
            deviceId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );
      return response;
    } catch (error) {
      if (error.name === "CanceledError") {
        throw error;
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  locations: [],
  selectedLocation: {
    farm: null,
    house: null,
    pen: null,
  },
  loading: false,
  error: null,

  selectedSensor: null,
  sensorData: {
    readings: [],
    loading: false,
    error: null,
  },
  liveReadings: {
    history: [], // Array of last 10 entries for the live chart
  },
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
    setSelectedSensor: (state, action) => {
      state.selectedSensor = action.payload;
      state.liveReadings.history = [];
    },
    updateLiveReadings: (state, action) => {
      state.liveReadings.history = [
        ...state.liveReadings.history,
        {
          ...action.payload,
          timestamp: new Date().toISOString(),
        },
      ].slice(-10); // Keep only last 10 entries
    },
    clearSensorData: (state) => {
      state.selectedSensor = null;
      state.sensorData.readings = [];
      state.liveReadings.history = [];
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
        state.locations = action.payload.data;

        if (action.payload.data && action.payload.data.length > 0) {
          const firstFarm = action.payload.data[0];
          const firstHouse = firstFarm.houses?.[0] || null;
          const firstPen = firstHouse?.pens?.[0] || null;

          state.selectedLocation = {
            farm: firstFarm,
            house: firstHouse,
            pen: firstPen,
          };
        }
      })
      .addCase(fetchFarms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedLocation,
  clearSelectedLocation,
  setSelectedSensor,
  updateLiveReadings,
  clearSensorData,
} = farmsSlice.actions;

export default farmsSlice.reducer;

// Selectors
export const selectFarms = (state) => state.farms.locations;
export const selectSelectedLocation = (state) => state.farms.selectedLocation;
export const selectLoading = (state) => state.farms.loading;
export const selectError = (state) => state.farms.error;
export const selectSelectedSensor = (state) => state.farms.selectedSensor;
export const selectLiveReadings = (state) => state.farms.liveReadings;
