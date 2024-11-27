import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const availableProducts = products.filter(product => product.availability === "Available");

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Header */}
      <header className="mb-6">
       
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableProducts.map((product) => (
          <div key={product._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img 
              src={product.image?.url || 'https://via.placeholder.com/400'} 
              alt={product.productName} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-700">{product.productName}</h2>
              <p className="text-gray-500 mt-2">{product.description}</p>
              {/* You can add pricing or other details here if needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
