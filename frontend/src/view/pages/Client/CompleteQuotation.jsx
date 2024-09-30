import React from 'react';
import { Link } from 'react-router-dom'; // Import useNavigate
import { Step4 } from '../../../constants/assets';


const CompleteQuotation = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8">
                <div className="flex flex-col items-center justify-center">
                    <img src={Step4} alt="Checkmark" className="w-24 h-24" />
                    <hr className="my-2 border-t-2 border-gray-200" />
                    <br />
                    <h2 className="text-3xl font-bold text-gray-800 text-center">Complete Request</h2>
                    <p className="text-gray-500 mt-2 my-8 text-center">
                        To complete your quotation request, please verify your provided email or company
                        email first. We will not process your request if the email is not legitimately
                        verified.
                    </p>
                </div>
                <div className="mt-8 flex justify-center">
                <Link
                    to="/"
                    className="px-6 py-3 rounded-lg shadow bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300"
                >
                    Complete
                </Link>
                </div>
            </div>
        </div>
    );
};

export default CompleteQuotation;
