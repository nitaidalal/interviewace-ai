import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../redux/slices/authSlice.js";
import { logoutUser } from "../api/authApi.js";
import { ROUTES } from "../utils/constants.js";
import toast from "react-hot-toast";
// import { parseApiError } from "../utils/errorParser.js";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth,
  );

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Even if API fails, clear local state
    } finally {
      dispatch(clearUser());
      navigate(ROUTES.LOGIN);
      toast.success("Logged out successfully");
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
};

export default useAuth;
