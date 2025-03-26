import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Components
import ProfilePic from "./ProfilePic";
import {
  FloatingLabelInput,
  FileUpload,
  CountryStateSelect,
  PhoneNumberInput,
} from "../../Components/Input";
import { SocialLinkAddOrDelete } from "../../Components/SocialMedia";

// Store
import { useAuthStore } from "../../Store/useAuthStore";
import { useUserStore } from "../../Store/useUserStore";

// Utils
import { capitalize } from "../../Utils/StringManager";
import { getDateDetails } from "../../Utils/DateManager";

const SubTitle = ({ className, children }) => {
  return (
    <h2 className={`text-neutral font-medium underline mb-2 ${className}`}>
      {children}
    </h2>
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

const CandidateProfile = () => {
  const { user } = useAuthStore();
  const { profile, getProfile, uploadResume } = useUserStore();

  const initialProfileInfo = {
    contact: {
      phoneNumber: "",
      socialMedia: {
        facebook: "",
        instagram: "",
      },
    },
    location: {
      country: "",
      state: "",
    },
    education: [
      {
        degree: String,
        institution: String,
        yearOfGraduation: Number,
      },
    ],
    experience: [
      {
        jobTitle: String,
        company: String,
        yearsOfExperience: Number,
        description: String,
      },
    ],
    skills: [],
    resume: "",
  };

  const [profileInfo, setProfileInfo] = useState(initialProfileInfo);

  const handlePhoneNumberChange = (phone) => {
    console.log(phone);

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
      let res = await uploadResume({ resume: file });

      return res;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    let fetchProfile = async () => {
      try {
        await getProfile();
      } catch (error) {}
    };

    fetchProfile();
  }, []);

  return (
    <>
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

        <div className="w-full flex flex-col gap-y-4 my-4">
          <FloatingLabelInput
            label="Name"
            name="name"
            id="name"
            value={capitalize(user?.name)}
            readOnly={true}
          />

          <FloatingLabelInput
            label="Email"
            name="email"
            id="email"
            value={user?.email}
            readOnly={true}
          />

          <FloatingLabelInput
            label="Gender"
            name="gender"
            id="gender"
            value={capitalize(user?.gender)}
            readOnly={true}
          />
        </div>

        {/* Account Information */}
        <div className="my-4">
          <SubTitle>Account Information</SubTitle>

          <Row>
            <Para>Member Since</Para>
            <Para>{getDateDetails(user?.createdAt, false)}</Para>
          </Row>

          <Row>
            <Para>Account Status</Para>
            <Para>Active</Para>
          </Row>
        </div>

        {/* Contact Information */}
        <div className="my-4 flex flex-col gap-y-2">
          <SubTitle>Contact Information</SubTitle>

          {/* <FloatingLabelInput
            label="Phone Number"
            name="phoneNumber"
            id="phoneNumber"
            type="tel"
            value={
              profile?.contact?.phoneNumber || profileInfo?.contact?.phoneNumber
            }
            checked=""
            readOnly=""
            handleInputChange={handlePhoneNumberChange}
          /> */}

          <PhoneNumberInput
            value={profileInfo.contact.phoneNumber}
            handlePhoneNumberChange={handlePhoneNumberChange}
          />

          <SocialLinkAddOrDelete
            socialMediaObj={profileInfo.contact.socialMedia}
            setProfileInfo={setProfileInfo}
          />
        </div>

        <div className="my-4">
          <CountryStateSelect
            country={
              profile?.location?.country || profileInfo?.location?.country
            }
            state={profile?.location?.state || profileInfo?.location?.state}
            onLocationChange={handleLocationChange}
          />
        </div>

        <div>
          <SubTitle>Resume</SubTitle>

          <FileUpload
            label="Resume"
            id="resume"
            name="resume"
            img={profile?.resume}
            accept=".pdf,.doc,.docx,.jpg,.png"
            handleUpload={handleResumeUpload}
          />
        </div>
      </section>
    </>
  );
};

export default CandidateProfile;
