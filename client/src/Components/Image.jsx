export const ProfilePicSM = ({ imgSrc, alt, className }) => {
  return (
    <>
      <div
        className={`size-10 bg-main rounded-full flex justify-center items-center ${className}`}
      >
        <img
          src={imgSrc || "Icons/avatar.png"}
          alt={{ alt } || "Image"}
          className="w-full h-full hover:outline-double hover:outline-main object-cover rounded-full"
        />
      </div>
    </>
  );
};
