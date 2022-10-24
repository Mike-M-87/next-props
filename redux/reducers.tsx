import { createSlice } from "@reduxjs/toolkit";
import {useMatchMedia} from "../pages/community/[id]";

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    showNav: false,
  },
  reducers: {
    toggle: (state) => {
      state.showNav = !state.showNav;
    },
    show: (state) => {
      state.showNav = true;
    },
    hide: (state) => {
      state.showNav = false;
    },
  },
});

export const communitySlice = createSlice({
  name: "community",
  initialState: { community: { name: "Nouns" } },
  reducers: {
    update: (state, action) => {
      state.community = action.payload;
    },
  },
});

export const sidebarActions = sidebarSlice.actions;
export const communityActions = communitySlice.actions;
