// Component
import ProfilePic from "./ProfilePic";

const CreatorProfile = () => {
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
      </section>
    </>
  );
};

export default CreatorProfile;
