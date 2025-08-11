import Role from "../models/role.js";

export const getAllRoles = async () => {
  const roles = await Role.find();
  return roles;
};

export default {
  getAllRoles,
};
