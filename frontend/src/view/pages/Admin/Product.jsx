import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrashAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../components/Admin/AdminContainer';  
import { useNavigate } from 'react-router-dom';
import EditProductModal from '../../components/Admin/EditProductModal';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedProductId, setHighlightedProductId] = useState(null); // State for highlighting
  const productRefs = useRef({}); // Ref for each product

  const navigate = useNavigate();

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

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/products/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = (updatedProduct) => {
    setProducts(products.map(product =>
      product._id === updatedProduct._id ? updatedProduct : product
    ));
  };

  // Sorting logic
  const sortProducts = (products, criteria) => {
    switch (criteria) {
      case 'name':
        return [...products].sort((a, b) => a.productName.localeCompare(b.productName));
      case 'available':
        return products.filter(product => product.availability === 'Available');
      case 'pending':
        return products.filter(product => product.availability === 'Pending');
      case 'notAvailable':
        return products.filter(product => product.availability === 'NotAvailable');
      default:
        return products; // Show all products by default
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      setIsDropdownOpen(true); // Show dropdown when there's input
      const filtered = products.filter(product =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered); // Update filtered products
    } else {
      setIsDropdownOpen(false); // Hide dropdown when input is empty
    }
  };

  // Handle product selection from dropdown
  const handleProductSelect = (product) => {
    setSearchQuery(product.productName); // Set the selected product name as the search query
    setIsDropdownOpen(false); // Close the dropdown
    setHighlightedProductId(product._id); // Set the highlighted product ID

    // Scroll to the selected product
    const productRef = productRefs.current[product._id];
    if (productRef) {
      productRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const sortedProducts = sortProducts(products, sortCriteria);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        {/* Search Input and Controls Wrapper */}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto">
          <div className="relative flex-grow mb-4 sm:mb-0 sm:mr-4 lg:w-[870px]">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

            {/* Dropdown for search suggestions */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleProductSelect(product)} // Select product from dropdown
                    >
                      {product.productName}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No products found</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center mb-4 sm:mb-0">
            <label className="mr-2 text-sm">Sort by</label>
            <select 
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="notAvailable">Not Available</option>
            </select>
            <button className="ml-2 p-2 text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={faFilter} />
            </button>
          </div>
        </div>

        {/* Add Products Button */}
        <button 
          className="bg-red-700 text-white py-2 px-4 rounded-lg sm:ml-4 mt-4 sm:mt-0"
          onClick={() => navigate('/admin-addproducts')}
        >
          Add Products
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full hidden md:table">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left">Product Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr
                key={product._id}
                className={`border-b ${highlightedProductId === product._id ? 'bg-yellow-100' : ''}`} // Highlight if selected
                ref={el => (productRefs.current[product._id] = el)} // Assign ref to product row
              >
                <td className="py-4 px-6 text-sm sm:text-base">{product.productName}</td>
                <td className="py-4 px-6 text-sm sm:text-base">{product.description}</td>
                <td className="py-4 px-6">
                  {product.image && product.image.url ? (
                    <img
                      src={product.image.url}
                      alt={product.productName}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-sm sm:text-base">No image</span>
                  )}
                </td>
                <td className="py-4 px-6 text-sm sm:text-base">
                  <button
                    className={`py-2 px-4 rounded-lg ${
                      product.availability === 'Available'
                        ? 'bg-teal-100 text-teal-700'
                        : product.availability === 'Pending'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {product.availability}
                  </button>
                </td>
                <td className="py-4 px-6 flex justify-start space-x-2">
                  <button
                    className="text-gray-600 hover:text-gray-900 ml-2"
                    onClick={() => handleEdit(product)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-900 ml-2"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile view */}
        <div className="md:hidden">
          {sortedProducts.map((product) => (
            <div
              key={product._id}
              className={`border-b border-gray-200 p-4 ${highlightedProductId === product._id ? 'bg-yellow-100' : ''}`} // Highlight if selected
              ref={el => (productRefs.current[product._id] = el)} // Assign ref to product
            >
              <div className="flex flex-col items-start">
                <img
                  src={product.image && product.image.url ? product.image.url : ''}
                  alt={product.productName}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="mt-2 w-full">
                  <h3 className="text-lg font-semibold truncate">{product.productName}</h3>
                  <p className="text-sm mt-1">{product.description}</p>
                  <p className="text-sm mt-2">
                    <span
                      className={`py-1 px-2 rounded-lg ${
                        product.availability === 'Available'
                          ? 'bg-teal-100 text-teal-700'
                          : product.availability === 'Pending'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.availability}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => handleEdit(product)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => handleDelete(product._id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
};

export default Product;
