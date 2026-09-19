import UserActivity from "../models/userActivityModel.js";
import Notification from "../models/notificationModel.js";

const getNotificationType = (action) => {
  switch (action) {
    case "password_changed":
      return "security";

    case "admin_updated":
      return "admin";

    case "profile_updated":
    case "profile_picture_updated":
    case "email_verified":
    case "registered":
    case "deleted":
      return "account";

    default:
      return "system";
  }
};

const getNotificationTitle = (action) => {
  switch (action) {
    case "password_changed":
      return "Password Changed";

    case "admin_updated":
      return "Administrator Access Updated";

    case "profile_updated":
      return "Profile Updated";

    case "profile_picture_updated":
      return "Profile Picture Updated";

    case "email_verified":
      return "Email Verified";

    case "registered":
      return "Account Created";

    case "deleted":
      return "Account Deleted";

    default:
      return "Account Activity";
  }
};

const createUserActivityAndNotification = async ({ activity, session = null }) => {
  const options = session ? { session } : {};

  const [createdActivity] = await UserActivity.create([activity], options);

  await Notification.create(
    [
      {
        recipient: activity.user,

        type: getNotificationType(activity.action),

        title: getNotificationTitle(activity.action),

        message: activity.description,

        relatedType: "user_activity",

        relatedId: createdActivity._id,
      },
    ],
    options,
  );

  return createdActivity;
};

export { createUserActivityAndNotification };
