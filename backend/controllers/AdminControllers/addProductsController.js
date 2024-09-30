import Product from "../../models/Admin/addProducts.js";

const createProduct = async (req, res) => {
  try {
    const { productName, description, availability, image } = req.body;

    if (!image || !image.url) {
      return res.status(400).json({ error: 'No image URL provided' });
    }

    // Create a new product with the data received from the frontend
    const newProduct = new Product({
      productName: productName,
      description: description,
      image: image,
      availability: availability,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();
    
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error in createProduct:", error.message);
    return res.status(500).json({ error: error.message || 'An error occurred while creating the product' });
  }
};

    export const getProducts = async (req, res) => {
    try {
      const products = await Product.find({});
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  };


  const updateProduct = async (req, res) => {
    const { productName, description, availability, image } = req.body;
    const { id } = req.params;

    try {
        let updatedFields = {
            productName,
            description,
            availability,
        };

        if (image && image.url) {
            // Update the image URL directly from the request
            updatedFields.image = {
                url: image.url,
                publicId: image.publicId || null, // Handle publicId if needed
            };
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
};




  

  export const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error("Error deleting product:", error.message);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  };
  
export { createProduct, updateProduct };
