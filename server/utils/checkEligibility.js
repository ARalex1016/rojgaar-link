export const checkEligibility = (user, profile) => {
  if (user.role === "candidate") {
    if (
      profile.contact?.phoneNumber &&
      profile?.resume &&
      Object.keys(profile.resume).length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  if (user.role === "creator") {
    if (profile.contact?.phoneNumber) {
      return true;
    } else {
      return false;
    }
  }
};
