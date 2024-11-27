import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';  // Add faArrowLeft here
import { Loginback } from '../../../constants/assets';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (email === '') {
      setError('We cannot find your email.');
    } else {
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/users/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
        if (response.ok) {
          setError(null);
          alert('Password reset link sent to your email');
        } else {
          setError(data.message || 'Something went wrong');
        }
      } catch (err) {
        setError('An error occurred');
      }
    }
  };
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${Loginback})` }}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <FontAwesomeIcon icon={faEnvelope} size="3x" className="text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Forgot Password</h2>
          <p className="text-gray-500 mt-2">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-4 text-gray-500" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white p-3 rounded-lg shadow hover:bg-yellow-600 transition duration-300"
          >
            Submit
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-gray-700 hover:text-red-600 transition duration-300">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
