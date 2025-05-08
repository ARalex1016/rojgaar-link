// Model
import CandidateProfile from "../Models/candidateProfile.model.js";
import CreatorProfile from "../Models/creator-profile.model.js";

export const checkEligibility = async (user, profile) => {
  let previousEligibility = user.eligible;

  if (!profile) {
    if (user.role === "candidate") {
      profile = await CandidateProfile.findOne({ userId: user._id });
    } else if (user.role === "creator") {
      profile = await CreatorProfile.findOne({ userId: user._id });
    }
  }

  let eligibility = false;

  if (user.isEmailVerified) {
    if (user.role === "candidate") {
      const hasValidResume =
        profile?.resume && Object.keys(profile.resume).length > 0;

      eligibility = !!(profile.contact?.phoneNumber && hasValidResume);
    }

    if (user.role === "creator") {
      eligibility = !!profile.contact?.phoneNumber;
    }
  }

  if (eligibility !== previousEligibility) {
    user.eligible = eligibility;
    await user.save();
  }

  return;
};
