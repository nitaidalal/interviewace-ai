import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../../api/authApi.js";
import { setUser } from "../../redux/slices/authSlice.js";
import { parseApiError, parseFieldErrors } from "../../utils/errorParser.js";
import { ROUTES } from "../../utils/constants.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import PasswordInput from "../../components/ui/PasswordInput.jsx";

const initialForm = { email: "", password: "" };

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await loginUser(form);
      dispatch(setUser(res.data.data.user));
      toast.success(res.data.message || "Logged in successfully");
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const fieldErrors = parseFieldErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        toast.error(parseApiError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        required
        disabled={loading}
      />

      <PasswordInput
        label="Password"
        name="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        required
        disabled={loading}
      />

      <Button type="submit" fullWidth loading={loading} size="lg">
        Sign In
      </Button>

      <p
        className="text-center text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Don't have an account?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          Create one
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
