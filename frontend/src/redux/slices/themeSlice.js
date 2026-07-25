import { createSlice } from "@reduxjs/toolkit";
import { THEME } from "../../utils/constants.js";

const getInitialTheme = () => {
  const stored = localStorage.getItem("theme");
  if (stored === THEME.DARK || stored === THEME.LIGHT) return stored;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    return THEME.DARK;
  return THEME.LIGHT;
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: initialTheme,
  },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
      applyTheme(state.mode);
    },
    setTheme(state, action) {
      state.mode = action.payload;
      applyTheme(action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
