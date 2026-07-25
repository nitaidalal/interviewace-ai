import User from "../models/user.model.js";

const userRepository = {
  async findByEmail(email) {
    return User.findOne({ email }).select("+password");
  },

  async findById(id) {
    return User.findById(id);
  },

  async findByIdWithPassword(id) {
    return User.findById(id).select("+password");
  },

  async create(data) {
    return User.create(data);
  },

  async updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async existsByEmail(email) {
    return User.exists({ email });
  },

  async findAllCandidates() {
    return User.find({ role: "candidate" }).select("-password");
  },

  async deleteById(id) {
    return User.findByIdAndDelete(id);
  },

  async promoteToAdmin(email) {
    return User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
  },
};

export default userRepository;
