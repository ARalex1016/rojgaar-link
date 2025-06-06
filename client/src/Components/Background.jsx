export const Background = ({ className, children }) => {
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

export const BackgroundWithOutFooter = ({ className, children }) => {
  return (
    <>
      <main
        className={`flex justify-center items-center ${className}`}
        style={{ minHeight: "calc(100vh - var(--menuHeight))" }}
      >
        {children}
      </main>
    </>
  );
};
