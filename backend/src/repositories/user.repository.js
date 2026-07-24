import User from "../models/user.model.js";

const userRepository = {
  async findByEmail(email) {
    return User.findOne({ email }).select("+passwordHash");
  },

  async findById(id) {
    return User.findById(id);
  },

  async findByIdWithPassword(id) {
    return User.findById(id).select("+passwordHash");
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
    return User.find({ role: "candidate" }).select("-passwordHash");
  },

  async deleteById(id) {
    return User.findByIdAndDelete(id);
  },

  async promoteToAdmin(email) {
    return User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
  },
};

export default userRepository;
