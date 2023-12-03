import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const backgroundImageUrl = "https://i.pinimg.com/originals/b6/07/6b/b6076bb4df9a3532e01ad33b4e563643.jpg";

  const divStyle: React.CSSProperties = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh", // Thi?t l?p chi?u cao c?a background
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  return (
    <div style={divStyle}>
      {children}
    </div>
  );
};

export default AuthLayout;