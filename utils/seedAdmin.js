import User from "../modals/user.js";

export const seedAdmin = async () => {
  const count = await User.countDocuments();
  if (count > 0) return;

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  await User.create({ username, password, role: "admin" });
  console.log(`Default admin user created (username: ${username})`);
};
