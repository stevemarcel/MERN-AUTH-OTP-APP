import UserActivity from "../models/userActivityModel.js";
import Notification from "../models/notificationModel.js";

const NOTIFICATION_CONFIG = {
  registered: {
    type: "account",
    title: "Account Created",
  },

  email_verified: {
    type: "account",
    title: "Email Verified",
  },

  password_changed: {
    type: "security",
    title: "Password Changed",
  },

  profile_updated: {
    type: "account",
    title: "Profile Updated",
  },

  profile_picture_updated: {
    type: "account",
    title: "Profile Picture Updated",
  },

  admin_updated: {
    type: "admin",
    title: "Account Access Updated",
  },

  restored: {
    type: "account",
    title: "Account Restored",
  },

  // ! Activities are recorded, but we do NOT notify a user who is being deleted (removed).
  removed: null,
  deleted: null,
};

// * Creates a UserActivity record and, when configured, creates the corresponding user notification.
// * The notificationMessage is intentionally separate from description so the audit log and notification can use different wording.
const logUserActivity = async ({
  user,
  action,
  performedBy = null,
  description,
  notificationMessage = null,
  notify = true,
  session = null,
}) => {
  const options = session ? { session } : {};

  const [activity] = await UserActivity.create(
    [
      {
        user,
        action,
        performedBy,
        description,
      },
    ],
    options,
  );

  const notificationConfig = NOTIFICATION_CONFIG[action];

  if (notify && notificationConfig && notificationMessage) {
    await Notification.create(
      [
        {
          recipient: user,
          type: notificationConfig.type,
          title: notificationConfig.title,
          message: notificationMessage,
          relatedType: "user_activity",
          relatedId: activity._id,
        },
      ],
      options,
    );
  }

  return activity;
};

export default logUserActivity;
