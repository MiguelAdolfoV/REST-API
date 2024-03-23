import Product from "../models/Product";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(201).json(products);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, category, imgUrl } = req.body;
    const newProduct = new Product({ name, price, category, imgUrl });
    const productSave = await newProduct.save();

    res.status(201).json(productSave);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsbyid = async (req, res) => {
    try {
      const id = req.params.producID; // Obtener el ID de la URL
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  export const updateProduct = async (req, res) => {
    try {
      const productId = req.params.productId;
      const { name, price, category, imgUrl } = req.body;
      
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, price, category, imgUrl },
        { new: true }
      );
      
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
 
  
  export const deleteProduct = async (req, res) => {
    try {
      const productId = req.params.productId;
      
      const deletedProduct = await Product.findByIdAndDelete(productId);
      
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  