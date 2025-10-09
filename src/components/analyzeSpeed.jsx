import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🧠 1. Async Thunk - fake speed analysis
const analyzeSpeed = createAsyncThunk("speed/analyze", async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const speed = (Math.random() * 100).toFixed(2); // fake Mbps value
      resolve(speed);
    }, 2000);
  });
});

// ⚙️ 2. Slice
const speedSlice = createSlice({
  name: "speed",
  initialState: { loading: false, speed: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(analyzeSpeed.pending, (state) => {
        state.loading = true;
        state.speed = null;
        state.error = null;
      })
      .addCase(analyzeSpeed.fulfilled, (state, action) => {
        state.loading = false;
        state.speed = action.payload;
      })
      .addCase(analyzeSpeed.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to analyze speed!";
      });
  },
});

// 🏬 3. Store
const store = configureStore({
  reducer: { speed: speedSlice.reducer },
});

// ⚡ 4. UI Component
const SpeedAnalyzerComponent = () => {
  const dispatch = useDispatch();
  const { loading, speed, error } = useSelector((state) => state.speed);

  const handleAnalyze = () => {
    dispatch(analyzeSpeed());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-sans">
      <h1 className="text-3xl font-bold mb-6">⚡ Data Speed Analyzer</h1>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
      >
        {loading ? "Analyzing..." : "Start Test"}
      </button>

      <div className="mt-8 w-80 text-center">
        {loading && (
          <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
            <div className="bg-green-500 h-4 animate-pulse w-3/4"></div>
          </div>
        )}

        {speed && (
          <div className="mt-6 text-2xl font-bold">
            🚀 Speed: <span className="text-yellow-300">{speed} Mbps</span>
          </div>
        )}

        {error && (
          <div className="mt-6 text-red-400 font-semibold">{error}</div>
        )}
      </div>
    </div>
  );
};

// 🔥 5. Wrap with Redux Provider
const SpeedAnalyzer = () => (
  <Provider store={store}>
    <SpeedAnalyzerComponent />
  </Provider>
);

export default SpeedAnalyzer;
