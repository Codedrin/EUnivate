import React from 'react';
import Services_IMG from '../../../../assets/Services_IMG.png';
import Pie1 from '../../../../assets/pie1.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Services = () => {
  return (
    <div className="p-8 bg-white">
      <section className="text-center">
        <h2 className="text-4xl font-bold text-red-800 mb-4">Services</h2>
        <h3 className="text-5xl font-semibold space-x-2 mt-4">
          Explore a Diverse Range of <br /><span>Solutions</span>
        </h3>
        <p className="text-lg text-gray-500 mt-4 max-w-xl mx-auto">
          Our platform boasts a vast repository of solutions developed by talented student-professor teams across various disciplines. Here's a glimpse into the diverse range of categories you'll find.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {/* 1st div*/}
          <div className="rounded-lg shadow-lg border-gray-300 p-8">
            <div className="mb-4 flex items-center">
              <div className="relative w-10 h-10">
                <img 
                  src={Pie1} 
                  alt="Background" 
                  className="w-full h-full object-cover rounded-full" 
                />
                <div className="absolute inset-0 flex items-center justify-center text-red-900 font-semibold text-4xl">
                  01
                </div>
              </div>
            </div>
            <div className="text-start">
              <h3 className="text-3xl font-semibold">IT & Software Development</h3>
              <p className="text-black mt-2">
                Cutting-edge applications, AI-powered tools, and optimized software solutions.
              </p>
            </div>
          </div>
          {/* 2nd div*/}
          <div className="rounded-lg shadow-lg bg-red-50 p-8">
            <div className="mb-4 flex items-center">
              <div className="relative w-10 h-10">
                <img 
                  src={Pie1} 
                  alt="Background" 
                  className="w-full h-full object-cover rounded-full rotate-90" 
                />
                <div className="absolute inset-0 flex items-center justify-center text-red-900 font-semibold text-4xl">
                  02
                </div>
              </div>
            </div>
            <div className="text-start">
              <h3 className="text-3xl font-semibold">Engineering & Design</h3>
              <p className="text-black mt-2">
                Sustainable practices, efficient infrastructure solutions, and innovative product designs.
              </p>
            </div>
          </div>
          {/* 3rd div*/}
          <div className="rounded-lg shadow-lg border-gray-300 p-8">
            <div className="mb-4 flex items-center">
              <div className="relative w-10 h-10">
                <img 
                  src={Pie1} 
                  alt="Background" 
                  className="w-full h-full object-cover rounded-full" 
                />
                <div className="absolute inset-0 flex items-center justify-center text-red-900 font-semibold text-4xl">
                  03
                </div>
              </div>
            </div>
            <div className="text-start">
              <h3 className="text-3xl font-semibold">Business & Management</h3>
              <p className="text-black mt-2">
                Data-driven strategies, marketing campaigns, and streamlined business processes.
              </p>
            </div>
          </div>
          {/* 4th div*/}
          <div className="rounded-lg shadow-lg bg-red-50 p-8">
            <div className="mb-4 flex items-center">
              <div className="relative w-10 h-10">
                <img 
                  src={Pie1} 
                  alt="Background" 
                  className="w-full h-full object-cover rounded-full rotate-90" 
                />
                <div className="absolute inset-0 flex items-center justify-center text-red-900 font-semibold text-4xl">
                  04
                </div>
              </div>
            </div>
            <div className="text-start">
              <h3 className="text-3xl font-semibold">Education & Training</h3>
              <p className="text-black mt-2">
                Interactive learning platforms, personalized educational tools, and skill development programs.
              </p>
            </div>
          </div>
          {/* 5th div*/}
          <div className="rounded-lg shadow-lg p-8">
            <div className="mb-4 flex items-center">
              <div className="relative w-10 h-10">
                <img 
                  src={Pie1} 
                  alt="Background" 
                  className="w-full h-full object-cover rounded-full" 
                />
                <div className="absolute inset-0 flex items-center justify-center text-red-900 font-semibold text-4xl">
                  05
                </div>
              </div>
            </div>
            <div className="text-start">
              <h3 className="text-3xl font-semibold">Environmental Science</h3>
              <p className="text-black mt-2">
                Renewable energy solutions, waste management systems, and environmentally conscious practices.
              </p>
            </div>
          </div>
          {/* 6th div*/}
          <div className="rounded-lg shadow-lg bg-red-50 p-8">
            <div className="mb-4 flex items-center">
              <div className="relative w-10 h-10">
                <img 
                  src={Pie1} 
                  alt="Background" 
                  className="w-full h-full object-cover rounded-full rotate-90" 
                />
                <div className="absolute inset-0 flex items-center justify-center text-red-900 font-semibold text-4xl">
                  06
                </div>
              </div>
            </div>
            <div className="text-start">
              <h3 className="text-3xl font-semibold">Startup Resources</h3>
              <p className="text-black mt-2">
                Gain access to essential resources specifically designed to support startups, including mentorship programs, legal and financial consultations, and potential office space solutions (subject to availability and university policy).
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <img src={Services_IMG} alt="Main Service" className="rounded-lg shadow-lg" />
          </div>
          <div className="text-start">
            <span className="text-red-900 text-2xl font-bold">Features</span>
            <h2 className="text-5xl font-semibold text-gray-800 mt-4">Unveiling a World of Innovative Solution</h2>
            <p className="text-gray-500 mt-6">
              EUnivate is your gateway to a dynamic ecosystem of groundbreaking solutions. We bridge the gap between academic brilliance and industry needs, fostering collaboration that tackles real-world challenges. Whether you're a well-established company or a budding startup, EUnivate offers a wealth of resources to empower your success.
            </p>
            <p className="text-gray-500 mt-4">
              You will find every little thing on the internet in just a click of a hand, but here we admire that without knowledge and practice the internet may even also fail you in your life.
            </p>
            <button className="mt-8 px-8 py-3 bg-yellow-600 text-white font-semibold rounded-full shadow hover:bg-orange-600 flex items-center">
              Learn More <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
