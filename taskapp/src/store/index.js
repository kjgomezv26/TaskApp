import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice.js";
import tasks from "./slices/taskSlice.js";

const store = configureStore({
  reducer: { auth, tasks },
});

export default store;
