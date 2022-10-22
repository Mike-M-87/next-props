import { createSlice } from "@reduxjs/toolkit";

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    showNav: true,
  },
  reducers: {
    toggle: (state) => {
      state.showNav = !state.showNav;
    },
  },
});

export const communitiesSlice = createSlice({
  name: "communities",
  initialState: {
    communities: null,
  },
  reducers: {
    update: (state, action) => {
      state.communities = action.payload;
    },
  },
});

export const communitiesActions = communitiesSlice.actions;
export const sidebarActions = sidebarSlice.actions;
