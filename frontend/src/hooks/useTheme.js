import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, setTheme } from "../redux/slices/themeSlice.js";
import { THEME } from "../utils/constants.js";

const useTheme = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  return {
    mode,
    isDark: mode === THEME.DARK,
    toggle: () => dispatch(toggleTheme()),
    setLight: () => dispatch(setTheme(THEME.LIGHT)),
    setDark: () => dispatch(setTheme(THEME.DARK)),
  };
};

export default useTheme;
