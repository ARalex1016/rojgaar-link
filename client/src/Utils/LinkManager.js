import toast from "react-hot-toast";

export const validateSocialLink = (link, platform) => {
  let isValid = false;

  const facebookRegex = /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9(\.\?)?]/;
  const instagramRegex =
    /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9(\.\?)?]/;

  if (platform === "facebook") {
    isValid = facebookRegex.test(link);
    if (!isValid) toast.error("Invalid Facebook profile link.");
  } else if (platform === "instagram") {
    isValid = instagramRegex.test(link);
    if (!isValid) toast.error("Invalid Instagram profile link.");
  }

  return isValid;
};
