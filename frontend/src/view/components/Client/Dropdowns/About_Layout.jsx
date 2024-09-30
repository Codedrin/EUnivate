import React from 'react';
import { image1, image2, background } from '../../../../constants/assets';

const About_Layout = () => {
  return (
    <div className="bg-white w-full overflow-hidden relative">
      <h2 className="text-red-800 text-5xl font-bold mb-8 text-center md:text-left">About Us</h2>
      <div className="flex flex-col md:flex-row items-start mb-8 relative">
        <div className="flex-1 relative z-10">
          <h3 className="text-5xl flex flex-col md:flex-row md:items-start md:relative text-center md:text-left">
            <span className="text-red-700 block md:inline hidden md:block">EUni</span>
            <span className="text-yellow-500 block md:inline hidden md:block">vate</span>
            <span className="mt-4 md:mt-0 md:ml-1 relative z-20 text-center md:text-left hidden">
              Bridging the Gap
            </span>
            <span className="absolute left-0 top-full mt-1 flex-col z-10 hidden md:flex">
              <span>Between Innovation</span>
              <span className="mt-1">and Industry</span>
            </span>
          </h3>

          <div className="relative mt-8 md:mt-32 text-lg text-center md:text-left">
            <span className="block">
              EUnivate is a revolutionary platform fostering collaboration between
            </span>
            <span className="block mt-2">
              universities and industry. We empower businesses to tap into the vast
            </span>
            <span className="block mt-2">
              potential of academic expertise, while providing students and professors
            </span>
            <span className="block mt-2">
              with the opportunity to tackle real-world challenges and gain valuable
            </span>
            <span className="block mt-2">
              experience.
            </span>
          </div>
        </div>

        <div className=" justify-end ml-auto hidden md:flex">
          <div className="flex flex-col items-end space-y-2 ml-auto">
            <img
              src={image1}
              alt="Description of Image 1"
              className="w-78 h-48 object-cover rounded-lg mb-4 mt-[-5rem] z-20"
            />
            <img
              src={image2}
              alt="Description of Image 2"
              className="w-78 h-48 object-cover rounded-lg ml-[-10rem] mr-auto z-20"
            />
          </div>
        </div>

        <img
          src={background}
          alt="background"
          className="absolute rounded-lg right-16 bottom-10 top-[-10] w-90 h-80 object-cover z-0 hidden md:block"
        />
      </div>
    </div>
  );
};

export default About_Layout;
