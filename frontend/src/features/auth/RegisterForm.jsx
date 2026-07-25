import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../api/authApi.js";
import { setUser } from "../../redux/slices/authSlice.js";
import { parseApiError, parseFieldErrors } from "../../utils/errorParser.js";
import { ROUTES } from "../../utils/constants.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import PasswordInput from "../../components/ui/PasswordInput.jsx";
//import mail icon
// import { FaEnvelope } from "react-icons/fa";

const initialForm = { name: "", email: "", password: "" };

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await registerUser(form);
      dispatch(setUser(res.data.data.user));
      toast.success(res.data.message || "Account created successfully");
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
        label="Full Name"
        name="name"
        type="text"
        placeholder="John Doe"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
        disabled={loading}
      />

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
        placeholder="At least 6 characters"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        required
        disabled={loading}
      />

      <Button type="submit" fullWidth loading={loading} size="lg">
        Create Account
      </Button>

      <p
        className="text-center text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium"
          style={{ color: "var(--color-primary)" }}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
