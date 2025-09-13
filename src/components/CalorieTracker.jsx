import React, { useState } from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

// 1️⃣ Create Slice
const calorieSlice = createSlice({
  name: "calories",
  initialState: { items: [], totalCalories: 0 },
  reducers: {
    addFood: (state, action) => {
      state.items.push(action.payload);
      state.totalCalories += action.payload.calories;
    },
    removeFood: (state, action) => {
      const index = action.payload;
      const removed = state.items[index];
      state.items.splice(index, 1);
      state.totalCalories -= removed.calories;
    },
    resetAll: (state) => {
      state.items = [];
      state.totalCalories = 0;
    },
  },
});

const { addFood, removeFood, resetAll } = calorieSlice.actions;

// 2️⃣ Configure Store
const store = configureStore({
  reducer: { calories: calorieSlice.reducer },
});

// 3️⃣ Main Component
function CalorieTracker() {
  const { items, totalCalories } = useSelector((state) => state.calories);
  const dispatch = useDispatch();

  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");

  const handleAdd = () => {
    if (!food.trim() || !calories || isNaN(calories)) return;
    dispatch(addFood({ food, calories: Number(calories) }));
    setFood("");
    setCalories("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">🍎 Calorie Tracker</h1>

      {/* Input Section */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Food Item"
          className="p-2 rounded-lg text-black"
          value={food}
          onChange={(e) => setFood(e.target.value)}
        />
        <input
          type="number"
          placeholder="Calories"
          className="p-2 rounded-lg text-black"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
        >
          Add
        </button>
      </div>

      {/* Food List */}
      <div className="w-full max-w-lg bg-gray-800 p-4 rounded-xl shadow-lg">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center">No food items added yet.</p>
        ) : (
          items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-2 border-b border-gray-700"
            >
              <span>{item.food}</span>
              <span>{item.calories} kcal</span>
              <button
                className="bg-red-500 px-2 py-1 rounded-lg text-xs hover:bg-red-600"
                onClick={() => dispatch(removeFood(idx))}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* Total Calories */}
      <p className="text-xl font-semibold mt-4">
        Total Calories: <span className="text-yellow-400">{totalCalories} kcal</span>
      </p>

      {/* Reset Button */}
      {items.length > 0 && (
        <button
          onClick={() => dispatch(resetAll())}
          className="mt-4 px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600"
        >
          Reset
        </button>
      )}
    </div>
  );
}

// 4️⃣ Wrap App with Redux Provider
export default function App() {
  return (
    <Provider store={store}>
      <CalorieTracker />
    </Provider>
  );
}
