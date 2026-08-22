import UserActivity from "../models/userActivityModel.js";

const logUserActivity = async ({ user, action, performedBy = null, description }) => {
  try {
    await UserActivity.create({
      user,
      action,
      performedBy,
      description,
    });
  } catch (error) {
    // Activity logging should never break the main user operation
    console.error("User activity logging failed:", error.message);
  }
};

export default logUserActivity;
