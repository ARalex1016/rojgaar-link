import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Component
import { SocialMediaSelect } from "./Input";

// Utils
import { capitalize } from "../Utils/StringManager";
import { isValidURL } from "../Utils/StringManager";

// Icons
import { X } from "lucide-react";

export const SocialLinkAddOrDelete = ({ socialMediaObj, setProfileInfo }) => {
  const [options, setOptions] = useState(null);

  const socialMediaArray = Object.entries(socialMediaObj).filter(
    ([keyframes, value]) => value
  );

  useEffect(() => {
    const socialArray = Object.entries(socialMediaObj)
      .filter(([platform, value]) => value === "")
      .map(([platform, value]) => ({
        value: platform,
        label: capitalize(platform),
      }));

    setOptions(socialArray);
  }, [socialMediaObj]);

  const handleAddSocialLink = (link, platform) => {
    let isValid = isValidURL(link);

    if (!isValid) {
      toast.error("Link isn't valid!");
      return;
    }

    setProfileInfo((pre) => ({
      ...pre,
      contact: {
        ...pre.contact,
        socialMedia: {
          ...pre.contact.socialMedia,
          [platform]: link,
        },
      },
    }));
  };

  const handledeleteSocialLink = (platform) => {
    setProfileInfo((pre) => ({
      ...pre,
      contact: {
        ...pre.contact,
        socialMedia: {
          ...pre.contact.socialMedia,
          [platform]: "",
        },
      },
    }));
  };

  return (
    <>
      <div className="flex flex-col gap-y-2">
        {socialMediaArray.length >= 1 &&
          socialMediaArray.map(([platform, link], index) => {
            return (
              <div key={index} className="w-full flex flex-row">
                <input
                  type="text"
                  readOnly={true}
                  value={capitalize(platform)}
                  className="w-3/12 text-neutral font-medium bg-main border-2 border-main outline-none rounded-l-md px-2 py-1"
                />

                <input
                  type="text"
                  readOnly={true}
                  value={link}
                  className="w-7/12 text-neutral text-sm bg-transparent border-2 border-main border-x-0 outline-none px-2 py-1"
                />

                <button
                  onClick={() => handledeleteSocialLink(platform)}
                  className="w-2/12 text-neutral bg-red rounded-r-md flex flex-row justify-center items-center py-1"
                >
                  <X />
                </button>
              </div>
            );
          })}

        {options?.length >= 1 && (
          <SocialMediaSelect
            options={options}
            handleAddSocialLink={handleAddSocialLink}
          />
        )}
      </div>
    </>
  );
};
