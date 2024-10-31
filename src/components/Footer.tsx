import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-prymaryBlue py-4 flex justify-center px-8 text-white">
      <div>
        <p>@ Inovvati {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
