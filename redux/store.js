import { configureStore } from "@reduxjs/toolkit";
import { communitiesSlice, sidebarSlice } from "./reducers";

export default configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
    communities: communitiesSlice.reducer,
  },
});
