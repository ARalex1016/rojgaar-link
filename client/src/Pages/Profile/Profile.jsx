import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Components
import ProfilePic from "./ProfilePic";
import {
  FloatingLabelInput,
  CountryStateSelect,
  PhoneNumberInput,
  PDFUpload,
} from "../../Components/Input";
import {
  SocialLinkAddOrDelete,
  SocialMediaLinks,
} from "../../Components/SocialMedia";
import { PDFViewer } from "../../Components/PDFViewer";
import { BadgeCheckIcon } from "../../Components/Icons";
import VerifyEmailButton from "./VerifyEmailButton";
import { AlertBox, ConfirmAlertBox } from "../../Components/AlertBox";

// Icons
import { Loader } from "lucide-react";

// Store
import { useAuthStore } from "../../Store/useAuthStore";
import { useUserStore } from "../../Store/useUserStore";

// Utils
import { capitalize } from "../../Utils/StringManager";
import { getDateDetails } from "../../Utils/DateManager";

const SubTitle = ({ className, children }) => {
  return (
    <>
      <h2 className={`text-neutral font-medium underline mb-2 ${className}`}>
        {children}
      </h2>
    </>
  );
};

const Row = ({ hr = true, className, children }) => {
  return (
    <>
      <div className={`w-full flex flex-row justify-between ${className}`}>
        {children}
      </div>

      {hr && <hr className="text-neutral/40" />}
    </>
  );
};

const Para = ({ className, children }) => {
  return (
    <p className={`text-neutral/80 text-sm pb-3 ${className}`}>{children}</p>
  );
};

const Profile = () => {
  const { user, isCandidate } = useAuthStore();
  const { profile, getProfile, updatedProfileDetails, uploadResume } =
    useUserStore();

  const [profileInfo, setProfileInfo] = useState({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handlePhoneNumberChange = (phone) => {
    setProfileInfo((pre) => ({
      ...pre,
      contact: {
        ...pre.contact,
        phoneNumber: phone,
      },
    }));
  };

  const handleLocationChange = (newLocation) => {
    setProfileInfo((pre) => ({
      ...pre,
      location: {
        ...pre.location,
        ...newLocation,
      },
    }));
  };

  const handleResumeUpload = async (file) => {
    try {
      let res = await uploadResume(file);

      await AlertBox({
        title: "Uploaded!",
        text: "Your resume has been uploaded successfully.",
        icon: "success",
      });

      return res;
    } catch (error) {
      throw error;
    }
  };

  const handleUploadWithConfirmation = async (file) => {
    try {
      const result = await ConfirmAlertBox({
        title: "Replace existing resume?",
        text: "Uploading a new resume will replace your current one. Do you want to proceed?",
        icon: "warning",
        confirmButtonText: "Yes, replace it!",
      });

      if (result.isConfirmed) {
        // User confirmed, proceed with upload
        const response = await handleResumeUpload(file);

        return response;
      } else {
        // User cancelled upload, just return or do nothing
        return null;
      }
    } catch (error) {
      // Handle error gracefully
      await Swal.fire({
        title: "Upload failed",
        text: error.message || "Something went wrong during the upload.",
        icon: "error",
      });
      throw error; // rethrow if you want to handle it higher up
    }
  };

  const handleUpdate = async () => {
    setIsUpdatingProfile(true);

    try {
      let res = await updatedProfileDetails(profileInfo);
      toast.success(res.message);
    } catch (error) {
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  useEffect(() => {
    if (profile) {
      setProfileInfo(profile);
    } else {
      let fetchProfile = async () => {
        try {
          await getProfile();
        } catch (error) {
          toast.error("Failed to fetch profile.");
        }
      };
      fetchProfile();
    }
  }, [profile]);

  return (
    <>
      {Object.keys(profileInfo).length > 0 && (
        <section className="w-full py-2">
          {/* Profile */}
          <div className="w-full flex flex-col justify-center items-center">
            <h1 className="text-neutral text-xl font-medium">Profile</h1>
            <p className="text-neutral/80 text-sm mb-2">
              Your Profile Information
            </p>

            {/* Profile Pic */}
            <ProfilePic />
          </div>

          {/* User Information */}
          <div className="w-full flex flex-col gap-y-4 my-4">
            <SubTitle>User Information</SubTitle>

            <FloatingLabelInput
              label="Name"
              name="name"
              id="name"
              value={capitalize(user?.name)}
              readOnly={true}
            />

            <div className="w-full flex flex-row">
              <FloatingLabelInput
                label="Email"
                name="email"
                id="email"
                value={user?.email}
                readOnly={true}
              />

              {user?.isEmailVerified ? (
                <div className="w-16 bg-green-500 flex justify-center items-center rounded">
                  <BadgeCheckIcon size={30} className="text-primary" />
                </div>
              ) : (
                <VerifyEmailButton />
              )}
            </div>

            <FloatingLabelInput
              label="Gender"
              name="gender"
              id="gender"
              value={capitalize(user?.gender)}
              readOnly={true}
            />
          </div>

          {/* Contact Information */}
          <div className="my-4 flex flex-col gap-y-2">
            <SubTitle>Contact Information</SubTitle>

            <PhoneNumberInput
              value={profileInfo?.contact?.phoneNumber}
              handlePhoneNumberChange={handlePhoneNumberChange}
            />

            {/* <SocialMediaLinks socialMedia={profileInfo?.contact?.socialMedia} /> */}

            <SocialLinkAddOrDelete
              socialMediaObj={profileInfo?.contact?.socialMedia}
              setProfileInfo={setProfileInfo}
            />
          </div>

          {/* Location */}
          <div className="my-4">
            <CountryStateSelect
              country={profileInfo?.location?.country}
              state={profileInfo?.location?.state}
              onLocationChange={handleLocationChange}
            />
          </div>

          {/* Update Button */}
          <button
            title="Update Profile"
            disabled={isUpdatingProfile}
            onClick={handleUpdate}
            className={`w-full h-8 text-neutral text-lg rounded-md shadow-sm shadow-neutral/50 flex flex-row justify-center items-center py-1 mb-6 ${
              isUpdatingProfile
                ? "bg-gray cursor-not-allowed"
                : "bg-blue-600 cursor-pointer"
            }`}
          >
            {isUpdatingProfile ? (
              <Loader className="size-6 animate-spin" />
            ) : (
              "Update"
            )}
          </button>

          {/* Resume (For Candidate)*/}
          {isCandidate && (
            <div className="rounded-md shadow-inner shadow-neutral flex flex-col justify-center items-center transition-all duration-200 ease-in-out p-4">
              <SubTitle>Your Resume</SubTitle>

              <PDFViewer pdf={profile?.resume} label="View Resume" />

              <PDFUpload
                handlePdfUpload={
                  profile?.resume?.url
                    ? handleUploadWithConfirmation
                    : handleResumeUpload
                }
                className="mt-4"
              />
            </div>
          )}

          {/* Account Information */}
          <div className="my-4">
            <SubTitle>Account Information</SubTitle>

            {user && (
              <Row>
                <Para>Member Since</Para>
                <Para>{getDateDetails(user?.createdAt, false)}</Para>
              </Row>
            )}

            {profile && (
              <Row>
                <Para>Eligible Status</Para>
                <Para
                  className={`font-medium ${
                    user?.eligible ? "text-green-500" : "text-red"
                  }`}
                >
                  {user?.eligible ? "True" : "False"}
                </Para>
              </Row>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Profile;
