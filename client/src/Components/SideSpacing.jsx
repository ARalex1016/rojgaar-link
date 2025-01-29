const SideSpacing = ({ className, children }) => {
  return (
    <>
      <div className={`px-sideSpacing ${className}`}>{children}</div>
    </>
  );
};

export default SideSpacing;
