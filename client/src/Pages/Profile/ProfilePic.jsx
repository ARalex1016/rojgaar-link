import { useState } from "react";
import toast from "react-hot-toast";

// Store
import { useAuthStore } from "../../Store/useAuthStore";
import { useUserStore } from "../../Store/useUserStore";

// Icons
import { Camera } from "lucide-react";

const ProfilePic = () => {
  const { user } = useAuthStore();
  const { uploadProfilePic } = useUserStore();

  const [selectedPic, setSelectedPic] = useState(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  const handleProfileUpload = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;

      setIsUploadingProfile(true);
      setSelectedPic(base64Image);

      try {
        let res = await uploadProfilePic({ profilePic: base64Image });

        toast.success(res.message);
      } catch (error) {
        toast.error(error.message);
        setSelectedPic(null);
      } finally {
        setIsUploadingProfile(false);
      }
    };
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="relative py-2">
          <img
            src={selectedPic || user?.profilePic || "/Icons/avatar.png"}
            alt="User Profile"
            accept="image/*"
            className={`size-32 rounded-full object-cover border-2 ${
              isUploadingProfile && "animate-pulse"
            }`}
          />

          <label
            htmlFor="profile-upload"
            className={`absolute bottom-0 right-0 p-2 bg-gray rounded-full cursor-pointer transition-all duration-200 hover:scale-105 ${
              isUploadingProfile && "animate-pulse pointer-events-none"
            }`}
          >
            <Camera className="w-5 h-5 text-neutral" />

            <input
              type="file"
              name=""
              id="profile-upload"
              accept="image/*"
              disabled={isUploadingProfile}
              onChange={handleProfileUpload}
              className="hidden"
            />
          </label>
        </div>

        <p className="text-sm text-neutral/60">
          {isUploadingProfile
            ? "Uploading..."
            : "Click the camera icon to update your photo"}
        </p>
      </div>
    </>
  );
};

export default ProfilePic;
