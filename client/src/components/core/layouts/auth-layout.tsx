import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  backgroundImage: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  backgroundImage,
}) => {
  return (
    <section className="flex flex-col lg:flex-row min-h-screen bg-white">
      <div className="flex-1 flex items-center justify-center min-h-screen p-6 md:p-8 lg:p-12 lg:w-1/2">
        <div className="w-full max-w-md mx-auto">{children}</div>
      </div>

      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
    </section>
  );
};

export default AuthLayout;
