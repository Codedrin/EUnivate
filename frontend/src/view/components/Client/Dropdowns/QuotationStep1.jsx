import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faBuilding } from '@fortawesome/free-solid-svg-icons';

const QuotationStep1 = ({ formData, setFormData, nextStep }) => {
    return (
        <>
            {/* Header */}
            <h2 className="text-3xl font-bold text-gray-800 text-center">Get a project quote</h2>
            <p className="text-gray-500 mt-2 text-center">
                Please fill the form below to receive a quote for your project. Feel free to add as much detail as needed.
            </p>
            

            {/* Form Container */}
            <div className="w-full max-w-lg mx-auto mt-8">
                <div className="flex items-center justify-center space-x-2 mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full">
                            1
                        </div>
                        <div className="h-1 w-16 bg-red-600"></div>
                    </div>
                    <div className="h-1 w-16 bg-gray-300"></div>
                    <div className="h-1 w-16 bg-gray-300"></div>
                    <div className="h-1 w-16 bg-gray-300"></div>
                </div>
                <hr className="my-4 border-t-2 border-gray-200" />
                <br />

                <h1 className = "font-semibold mb-3 text-xl text-gray-800">Contact details</h1>
                <p className='mb-5 text-gray-800'>Please fill your information so we can get in touch with you.</p>


                <div className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block font-semibold text-gray-600 mb-2">Name</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faUser} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    name='name'
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-3 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label className="block font-semibold text-gray-600 mb-2">Email</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faEnvelope} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name='email'
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-3 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block font-semibold text-gray-600 mb-2">Phone Number</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faPhone} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    name='phone'
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-3 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label className="block font-semibold text-gray-600 mb-2">Company</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faBuilding} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Company name"
                                    name='company'
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full pl-3 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={nextStep}
                        className="bg-yellow-500 text-white py-3 px-6 rounded-lg shadow hover:bg-yellow-600 transition duration-300"
                    >
                        Next step
                    </button>
                </div>
            </div>
        </>
    );
};

export default QuotationStep1;
