import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import { EXPERIENCE_MAP } from "../utils/constants.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const authService = {
  async register({ name, email, password }) {
    const exists = await userRepository.existsByEmail(email);
    if (exists) throw new ApiError(409, "Email is already registered");

    const isAdmin = email === process.env.ADMIN_SEED_EMAIL;
    const role = isAdmin ? "admin" : "candidate";

    const user = await userRepository.create({
      name,
      email,
      password,
      role,
    });

    const token = generateToken(user._id);

    return { user, token,role };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new ApiError(401, "Invalid email or password");

    if (!user.isActive)
      throw new ApiError(403, "Your account has been deactivated");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid email or password");

    const token = generateToken(user._id);

    return { user, token };
  },

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  },
};

export default authService;
