import React from 'react';
import { Button } from 'react-scroll';

import { 
  thinkTogether, 
  indMeets, 
  futureSolution, 
  light, 
  fifty, 
  proj_man, 
  twenty,
  yellow_gradient,
  red_gradient,
  loop,
  cisco,
  oracle,
  sap,
  star_sea,
} from '../../../../constants/assets';

const Hero = () => {
  return (
    <>
      <section id="Hero" className="py-16 px-8 lg:px-24 flex flex-col lg:flex-row justify-between items-center relative">
        {/* Red Gradient */}
        <img 
          src={red_gradient} 
          alt="Red Gradient" 
          className="absolute bottom-2 lg:w-[400px] lg:h-[500px] w-[500px] h-[400px] hidden sm:block" 
        />
        
        {/* Yellow Gradient */}
        <img 
          src={yellow_gradient} 
          alt="Yellow Gradient" 
          className="absolute top-2 right-[-100px] lg:w-[500px] lg:h-[500px] w-[400px] h-[400px] z-20 hidden sm:block" 
        />
        
        {/* Loop SVG (Top Left) */}
        <img 
          src={loop} 
          alt="Loop" 
          className="absolute top-2 lg:w-[400px] lg:h-[450px] w-[450px] h-[400px] z-30 hidden sm:block"
        />
        <img 
          src={loop} 
          alt="Loop Mobile" 
          className="absolute top-[10%] left-[5%] lg:w-[300px] lg:h-[300px] w-[250px] h-[250px] z-30 block sm:hidden"
        />

        <div className="lg:w-1/2 w-full relative z-10">
          <h1 className="text-red-800 lg:text-6xl text-4xl font-bold leading-tight relative z-30">
            Empower 
            <span className="text-black"> Your Business. </span>
            Unleash <span className="text-black">University Innovation</span>
          </h1>
          <p className="text-gray-700 text-lg lg:text-xl mt-4 lg:mt-8 relative z-30">
            EUnivate connects your business with the brightest minds from universities. Tap into cutting-edge solutions, reduce development costs, and gain a competitive edge through real-world innovation.
          </p>

          <div className="flex space-x-4 mt-8">
            <Button 
              to="CTA" 
              spy={true} 
              smooth={true} 
              offset={50} 
              duration={500}
              className="bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-red-800 transition-all duration-300 relative z-30"
            >
              Get Started
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-12 mt-8 sm:mt-16 relative z-30">
            <div className="hidden sm:flex items-center">
              <img src={thinkTogether} alt="Innovate Together" className="w-8 h-8" />
              <span className="text-sm ml-2">Innovate Together</span>
            </div>
            
            <div className="hidden sm:flex items-center">
              <img src={futureSolution} alt="Future Solutions" className="w-8 h-8" />
              <span className="text-sm ml-2">Future Solutions</span>
            </div>
            <div className="hidden sm:flex items-center">
              <img src={indMeets} alt="Industry Meets Minds" className="w-8 h-8" />
              <span className="text-sm ml-2">Industry Meets Minds</span>
            </div>
          </div>

          {/* 20+ Collaboration on Mobile */}
          <div className="flex flex-col items-start justify-center mt-4 sm:hidden">
            <span className="text-red-700 font-bold text-4xl">20+</span>
            <span className="text-lg">Collaboration</span>
          </div>
        </div>

        <div className="hidden md:block lg:w-1/2 w-full mt-8 lg:mt-0 relative z-10">
  <img src={light} alt="Hero" className="w-[600px] h-[600px] object-cover rounded-full" />


          <div className="absolute top-[90px] p-1 hidden sm:block"> 
            <img src={fifty} alt="50+ Experts Icon" className="w-[180px] h-[120px]" />
          </div>
          <div className="absolute top-4 right-20 hidden sm:block">
            <img src={twenty} alt="20+ Solutions Icon" className="w-[200px] h-[280px]" />
          </div>
          <div className="absolute bottom-1 left-[200px] hidden sm:block">
            <img src={proj_man} alt="Project Management Tool Icon" className="w-[400px] h-[130px]" />
          </div>
          {/* Additional Loop SVG (Below Light Image) */}
          <img 
            src={loop} 
            alt="Loop Below" 
            className="absolute bottom-[-250px] right-[-200px] lg:w-[500px] lg:h-[500px] w-[300px] h-[300px] z-[-1] hidden sm:block" 
          />
        </div>
      </section>

      {/* Collaboration Section for Desktop */}
      <section className="bg-white py-12 lg:py-16 px-8 lg:px-24 mb-8 text-center">
        <div className="justify-center items-center space-x-28 hidden sm:flex">
          <div className="text-left">
            <span className="text-red-700 font-bold text-5xl block">20+</span>  
            <span className="text-3xl">Collaboration</span>
          </div>
          <img src={star_sea} alt="Star of the Sea" className="w-28 h-28 object-contain filter grayscale" />
          <img src={sap} alt="SAP" className="w-28 h-28 object-contain filter grayscale" />
          <img src={cisco} alt="Cisco" className="w-28 h-28 object-contain filter grayscale" />
          <img src={oracle} alt="Oracle" className="w-28 h-28 object-contain filter grayscale" />
        </div>
      </section>
    </>
  );
};

export default Hero;
