import React from 'react';
import { Link } from 'react-router-dom';
import { Step4 } from '../../../constants/assets';
import { waitingverification } from '../../../constants/assets';
import { emailsent } from '../../../constants/assets';

const VerifyEmailQuotationSent = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8">
                <div className="flex flex-col items-center justify-center">
                    <img src={emailsent} alt="Checkmark" className="w-20 h-20 my-1" />
                    <hr className="my-2 border-t-2 border-gray-200" />
                    <br />
                    <h2 className="text-3xl font-bold text-gray-800 text-center">Complete Request</h2>
                    <p className="text-gray-500 mt-2 text-center">
                        To complete your quotation request, please verify your provided email or company
                        email first. We will not process your request if the email is not legitimately
                        verified.
                    </p>
                </div>
                <div className="flex justify-center">
                <img src={waitingverification} alt="Checkmark" className=" h-24" />
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailQuotationSent ;
