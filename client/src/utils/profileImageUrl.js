export const getProfileImageUrl = (profile, backendBaseUrl = "") => {
  if (!profile) {
    return `${backendBaseUrl}/uploads/profiles/placeholder.png`;
  }

  if (profile.startsWith("http://") || profile.startsWith("https://")) {
    return profile;
  }

  return `${backendBaseUrl}${profile}`;
};
