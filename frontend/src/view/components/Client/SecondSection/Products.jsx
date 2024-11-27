import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
  arrowIcon,
  twitterIcon,
  linkedinIcon,
  p1,
  p2,
  p3,
} from '../../../../constants/assets';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '100px',
    focusOnSelect: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: '30px',
        },
      },
    ],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  const availableProducts = products.filter(product => product.availability === "Available");

  return (
    <div className="space-y-16">
      {/* Carousel Section */}
      <div className="flex flex-col items-center text-center font-sans">
        <span className="text-red-800 font-bold text-lg mb-2">
          Project Management Tool
        </span>
        <span className="text-3xl font-semibold mb-10">
          Streamlining Project Success with Project Management Tool
        </span>

        <Slider {...settings} className="w-full max-w-screen-xl mb-20">
          {[p1, p2, p3].map((image, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Products Section */}
      {availableProducts.length > 0 && (
        <div className="space-y-8">
          <div className="text-left">
            <span className="text-red-800 font-bold block mb-2">
              Explore Programs
            </span>
            <h2 className="text-2xl font-bold mb-4">Our Featured Products</h2>
            <p className="text-sm">
              EUnivate is proud to feature innovative products developed by our talented student-professor teams.
            </p>
          </div>

          <div className="flex flex-wrap justify-center">
            {availableProducts.length === 1 ? (
              // Display single centered card
              <div key={availableProducts[0]._id} className="bg-white p-5 rounded-lg shadow-lg w-[337px] flex flex-col items-center">
                <div className="h-60 overflow-hidden mb-4">
                  <img 
                    src={availableProducts[0].image?.url || ''} 
                    alt={availableProducts[0].productName} 
                    className="w-full h-full object-cover rounded-md" 
                  />
                </div>
                <h3 className="text-lg font-bold text-center">
                  {availableProducts[0].productName}
                  <img src={arrowIcon} alt="Arrow Icon" className="ml-2 inline w-5 h-5" />
                </h3>
                <p className="text-sm mt-2 text-center">{availableProducts[0].description}</p>
              </div>
            ) : availableProducts.length < 4 ? (
              // Display multiple cards without slider
              availableProducts.map((product) => (
                <div key={product._id} className="bg-white p-5 rounded-lg shadow-lg w-[337px] mx-2">
                  <div className="h-60 overflow-hidden mb-4">
                    <img 
                      src={product.image?.url || ''} 
                      alt={product.productName} 
                      className="w-full h-full object-cover rounded-md" 
                    />
                  </div>
                  <h3 className="text-lg font-bold text-left flex items-center">
                    {product.productName}
                    <img src={arrowIcon} alt="Arrow Icon" className="ml-2 w-5 h-5" />
                  </h3>
                  <p className="text-sm mt-2">{product.description}</p>
                </div>
              ))
            ) : (
              // Display slider for four or more products
              <Slider {...settings} className="w-full max-w-screen-xl">
                {availableProducts.map((product) => (
                  <div key={product._id} className="bg-white p-5 rounded-lg shadow-lg w-[337px] cursor-pointer transform transition-transform hover:scale-105">
                    <div className="h-60 overflow-hidden mb-4">
                      <img 
                        src={product.image?.url || ''} 
                        alt={product.productName} 
                        className="w-full h-full object-cover rounded-md" 
                      />
                    </div>
                    <h3 className="text-lg font-bold text-left flex items-center">
                      {product.productName}
                      <img src={arrowIcon} alt="Arrow Icon" className="ml-2 w-5 h-5" />
                    </h3>
                    <p className="text-sm mt-2">{product.description}</p>
                  </div>
                ))}
              </Slider>
            )}
          </div>

          {/* Explore All Products Button */}
          <div className="flex justify-center mt-8">
          <Link to="/product">
    <button className="bg-white border border-black px-6 py-3 rounded-xl hover:bg-yellow-500 transition-all duration-300 mb-10">
      Explore All Products
    </button>
  </Link>
          </div>
        </div>
      )}

      {/* Professors Section */}
      <div className="professors-section-products text-2xl">
        {/* Your professors section code here */}
      </div>
    </div>
  );
};

export default Products;