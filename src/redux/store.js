import { configureStore } from "@reduxjs/toolkit";
import collapseReducer from "./slice/collapseSlice";
import loadingReducer from "./slice/loadingSlice";
export default configureStore({
  reducer: {
    collapse: collapseReducer,
    loading: loadingReducer,
  },
});
