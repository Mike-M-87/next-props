import { configureStore } from "@reduxjs/toolkit";
import { communitySlice, sidebarSlice } from "./reducers";

export default configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
    community: communitySlice.reducer,
  },
});
