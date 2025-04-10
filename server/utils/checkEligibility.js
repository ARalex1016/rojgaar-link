export const checkEligibility = (user, profile) => {
  if (user.role === "candidate") {
    if (profile.contact?.phoneNumber && profile?.resume) {
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
