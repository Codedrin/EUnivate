import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { Step4 } from '../../../../constants/assets'; 
import { submitquotation } from '../../../../constants/assets'; 

const QuotationStep4 = ({ prevStep, formData }) => {
   
    const navigate = useNavigate();

    const submitForm = async () => {
        
        try {
            console.log('submitForm triggered');
            console.log('Submitting form data:', formData); 
    
            const response = await fetch('http://localhost:5000/api/users/quotation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify(formData)
            });
    
            console.log('Server response:', response); //server response sa network 
    
            if (response.ok) {
                const result = await response.json();
                console.log('Form Data Submitted Successfully:', result);
    
                navigate('/email/quotation/verification-sent');
            } else {
                console.error('Error submitting form:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error); 
        }
    };

    return (
        <>
            {/* Header */}
            <h2 className="text-3xl font-bold text-gray-800 text-center">Get a project quote</h2>
            <p className="text-gray-500 mt-2 text-center">
                Please review all the information you previously typed in the past steps, and if all is okay, submit your message to receive a project quote in 24 – 48 hours.
            </p>
            
            {/* Step Progress Indicator */}
            <div className="w-full max-w-lg mx-auto mt-8">
                <div className="flex items-center justify-center space-x-2 mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="h-1 w-16 bg-gray-300"></div>
                        <div className="h-1 w-16 bg-gray-300"></div>
                        <div className="h-1 w-16 bg-gray-300"></div>
                        <div className="h-1 w-16 bg-red-600"></div>
                        <div className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full">
                            4
                        </div>
                    </div>
                </div>
                
                <hr className="my-4 border-t-2 border-gray-200" />
                <br />

                {/* Submission Icon and Text */}
                <div className="flex flex-col items-center justify-center mt-2 mb-4">
                    <img src={submitquotation} alt="Checkmark" className="w-24 h-24 my-2" />
                    <h1 className="font-semibold text-xl text-gray-800 mt-8">Submit your quote request</h1>
                    <p className="text-center text-gray-600 mt-4">
                        Please review all the information you previously typed in the past steps, and if all is okay, submit your message to receive a project quote in 24 – 48 hours.
                    </p>
                </div>
             
                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                    <button
                        onClick={prevStep}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition duration-300"
                    >
                        Previous step
                    </button>
                    <button
                        onClick={submitForm} 
                        className="px-12 py-3 bg-yellow-500 text-white rounded-lg flex shadow hover:bg-yellow-600 transition duration-300"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
};

export default QuotationStep4;
