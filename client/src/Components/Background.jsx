const Background = ({ className, children }) => {
  return (
    <>
      <main
        className={`min-h-[100dvh] bg-primary flex flex-col relative ${className}`}
      >
        {children}
      </main>
    </>
  );
};

export default Background;
