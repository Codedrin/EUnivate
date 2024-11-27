import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faInstagram, faDiscord } from "@fortawesome/free-brands-svg-icons";
import ButtonCircle from '../../../pages/SuperAdmin/Loading Style/Circle Loading/ButtonCircle';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [selectedSubject, setSelectedSubject] = useState('demo_request');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const isFormValid = () => {
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      companyEmail.trim() !== '' &&
      phoneNumber.trim() !== ''
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const contactData = {
      firstName,
      lastName,
      email: companyEmail,
      phone: phoneNumber,
      subject: selectedSubject,
      message,
    };

    setLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:5000/api/users/contactEunivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        toast.success('Message sent successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setFirstName('');
        setLastName('');
        setCompanyEmail('');
        setPhoneNumber('');
        setMessage('');
      } else {
        toast.error('Failed to send the message. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <section id="CTA" className="py-16 px-1 lg:px-24">
      <ToastContainer />
      <div className="max-w-1xl mx-auto">
        <div className="bg-white lg:shadow-lg rounded-lg p-8">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 w-full">
              <h2 className="text-3xl font-bold text-left mb-1 text-red-800">
                Contact EUnivate
              </h2>
              <p className="text-gray-600 text-left mb-8">
                Let's discuss how innovation can benefit you.
              </p>
              <div className="mb-8 mt-30 lg:mt-20 md:mt-12 sm:mt-8">
                <p className="text-gray-800 text-left mb-9 flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="mr-6" />
                  +639 12 345 6789
                </p>
                <p className="text-gray-800 text-left mb-9 flex items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-6" />
                  eunivate@gmail.com
                </p>
                <p className="text-gray-800 text-left mb-0 flex items-start">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-6" />
                  <span>
                    University Site, Ibabang Dupay <br />
                    Lucena City, Quezon Province
                  </span>
                </p>
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
                <div className="flex flex-col text-left">
                  <label htmlFor="first_name" className="block text-gray-400 text-sm font-bold mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none border-b-2 border-gray-400 w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col text-left">
                  <label htmlFor="last_name" className="block text-gray-700 text-sm font-bold mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none border-b-2 border-gray-400 w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col text-left">
                  <label htmlFor="company_email" className="block text-gray-400 text-sm font-bold mb-2">
                    Company Email
                  </label>
                  <input
                    type="email"
                    id="company_email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="appearance-none border-b-2 border-gray-400 w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col text-left">
                  <label htmlFor="phone_number" className="block text-gray-700 text-sm font-bold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="appearance-none border-b-2 border-gray-400 w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                  />
                </div>

                <div className="flex flex-col text-left md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2 mt-7">
                    Select Subject
                  </label>
                  <div className="flex flex-row space-x-4 mb-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="demo_request"
                        name="subject"
                        value="demo_request"
                        className="hidden"
                        checked={selectedSubject === 'demo_request'}
                        onChange={handleChange}
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 border-black flex items-center justify-center cursor-pointer ${selectedSubject === 'demo_request' ? 'bg-black' : ''}`}
                        onClick={() => setSelectedSubject('demo_request')}
                      >
                        {selectedSubject === 'demo_request' && <span className="text-white">✓</span>}
                      </div>
                      <label htmlFor="demo_request" className="ml-2 text-gray-700">
                        Demo Request
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="general_inquiry"
                        name="subject"
                        value="general_inquiry"
                        className="hidden"
                        checked={selectedSubject === 'general_inquiry'}
                        onChange={handleChange}
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 border-black flex items-center justify-center cursor-pointer ${selectedSubject === 'general_inquiry' ? 'bg-black' : ''}`}
                        onClick={() => setSelectedSubject('general_inquiry')}
                      >
                        {selectedSubject === 'general_inquiry' && <span className="text-white">✓</span>}
                      </div>
                      <label htmlFor="general_inquiry" className="ml-2 text-gray-700">
                        General Inquiry
                      </label>
                    </div>
                  </div>

                  <label htmlFor="message" className="block text-gray-400 text-sm font-bold mb-2 mt-7">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="2"
                    placeholder="Write your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border-b border-gray-400 w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 resize-none"
                  ></textarea>

                  <div className="flex justify-center mt-4 md:justify-end">
                    {loading ? (
                      <ButtonCircle />
                    ) : (
                      <button
                        type="submit"
                        className={`${
                          isFormValid()
                            ? "bg-yellow-500 hover:bg-red-700 cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed"
                        } text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full md:w-auto`}
                        disabled={!isFormValid()}
                      >
                        Send Message
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="hidden lg:flex justify-start mt-8 space-x-4">
            <div className="w-9 h-9 flex items-center justify-center bg-black rounded-full hover:bg-gray-800 transition-colors">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} className="text-white" />
              </a>
            </div>
            <div className="w-9 h-9 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} className="text-black" />
              </a>
            </div>
            <div className="w-9 h-9 flex items-center justify-center bg-black rounded-full hover:bg-gray-800 transition-colors">
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faDiscord} className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
