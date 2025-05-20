export const FullScreenBlock = ({
  children,
  isTransparent,
}: {
  children?: React.ReactNode;
  isTransparent?: boolean;
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: isTransparent ? 'transparent' : '#000075',
        transition: 'background-color 0.6s ease-in-out',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        zIndex: 9999,
      }}
    >
      {children}
    </div>
  );
};
