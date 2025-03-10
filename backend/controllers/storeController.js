import { storeModel } from "../models/Store.js";
import { cloudinary } from "../utils/cloudinary.js";

export const addStoreProduct = async (req, res) => {
  try {
      const id = req.params.id;

      // Use Cloudinary to upload the image
      const imageResult = await cloudinary.uploader.upload(req.file.path);

      const product = {
          img: imageResult.secure_url,
          title: req.body.title,
          description: req.body.description,
          price: req.body.price,
          weight: req.body.weight,
          category: req.body.category,
          tags: req.body.tags || [],
          storeId:id,
      }; 

      // Check if the store with the given ID exists
      const store = await storeModel.findOne({ _id: id });

      if (!store) {
          return res.status(404).json({ error: "Store not found." });
      }

      // Check for required fields
      const requiredFields = ['title', 'description', 'price', 'weight', 'category'];
      if (!requiredFields.every(field => product[field])) {
          return res.status(400).json({ error: "Required fields are missing." });
      }

      store.products = Array.isArray(store.products) ? store.products : [];
      // Add the new product to the store's products array
      store.products = [...store.products, product];

      // Save the updated store with the new product
      const updatedStore = await store.save();
      // Respond with the updated store data
      return res.status(200).json(updatedStore);
  } catch (error) {
      // Handle error
      console.error("Error adding product to store:", error);
      return res.status(500).send("Internal Server Error");
  }
};

export const AddStore = async (req, res) => {
  try {
    // Check for required fields
    if (!req.body.name || !req.body.store_email || !req.body.deliveryTime) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    // Use Cloudinary to upload the avatar
    const avatarResult = await cloudinary.uploader.upload(req.file.path);
    // Extract userId from the decoded JWT token
    const userId = req.decoded.id;
    console.log(userId)
    // Create a new store instance
    const newStore = new storeModel({
      name: req.body.name,
      userId: userId,
      store_email: req.body.store_email,
      deliveryTime: req.body.deliveryTime,
      description: req.body.description || null,
      avatar: avatarResult.secure_url, // Use the secure_url from Cloudinary response
      revenue: req.body.revenue || 0,
      sales: req.body.sales || 0,
      products: null,
      category: req.body.category || ["Grocery", "Organic"],
      tags: req.body.tags || ["Accepts EBT", "In-store prices"],
      id: req.body.id,
    });

    // Save the new store to the database
    const savedStore = await newStore.save();

    // Respond with the saved store data
    res.status(201).json(savedStore);
  } catch (error) {
    // Handle error
    console.error("Error adding store:", error);
    return res.status(500).send("Internal Server Error");
  }
};

//deletes the store from the db as the _id is recieved by params
export const deleteStore = async (req, res) => {
  try {
    const id = req.params.storeId;

    // Check if the store exists
    const existingStore = await storeModel.findById(id);
    if (!existingStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    // If the store exists, proceed with deletion
    const deletedStore = await storeModel.findByIdAndDelete(id);

    if (!deletedStore) {
      return res.status(500).json({ error: "Failed to delete store" });
    }

    return res.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//deletes a specific product from the db from a specific store both id's recieved via parameters.
export const deleteProduct = async (req, res) => {
  try {
      const storeId = req.params.storeId;
      const productId = req.params.productId;

      // Check if the store exists
      const existingStore = await storeModel.findById(storeId);
      if (!existingStore) {
          return res.status(404).json({ error: "Store not found" });
      }

      // Check if the product exists within the store
      const existingProductIndex = existingStore.products.findIndex(
          (product) => product._id.toString() === productId
      );

      if (existingProductIndex === -1) {
          return res.status(404).json({ error: "Product not found" });
      }

      // If the product exists, remove it from the array
      existingStore.products.splice(existingProductIndex, 1);

      // Save the updated store
      await existingStore.save();

      return res.json({ message: "Product deleted successfully" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
};


//update the details of the store
export const updateStoreController = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const body = req.body;

    // Check if the store exists
    const existingStore = await storeModel.findById(storeId);
    if (!existingStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Use Cloudinary to update the avatar
    const avatarResult = await cloudinary.uploader.upload(req.file.path);

    // Update the store fields manually
    existingStore.name = body.name || existingStore.name;
    existingStore.avatar = avatarResult.secure_url || existingStore.avatar;
    existingStore.store_email = body.store_email || existingStore.store_email;
    existingStore.deliveryTime = body.deliveryTime || existingStore.deliveryTime;
    existingStore.description = body.description || existingStore.description;
    existingStore.revenue = body.revenue || existingStore.revenue;
    existingStore.sales = body.sales || existingStore.sales;
    existingStore.category = body.category || existingStore.category;
    existingStore.tags = body.tags || existingStore.tags;

    // Save the updated store
    const updatedStore = await existingStore.save();

    return res.json(updatedStore);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//updates the product of the store of a specific store
export const updateProductController = async (req, res) => {
  try {
      const storeId = req.params.storeId;
      const productId = req.params.productId;
      const body = req.body;

      // Check if the store exists
      const existingStore = await storeModel.findById(storeId);
      if (!existingStore) {
          return res.status(404).json({ error: "Store not found" });
      }

      // Check if the product exists within the store
      const existingProduct = existingStore.products.find(
          (product) => product._id.toString() === productId
      );

      if (!existingProduct) {
          return res.status(404).json({ error: "Product not found" });
      }

      // Use Cloudinary to update the avatar
      const imageResult = await cloudinary.uploader.upload(req.file.path);

      // Update the product fields manually
      existingProduct.title = body.title || existingProduct.title;
      existingProduct.description = body.description || existingProduct.description;
      existingProduct.price = body.price || existingProduct.price;
      existingProduct.weight = body.weight || existingProduct.weight;
      existingProduct.category = body.category || existingProduct.category;
      existingProduct.tags = body.tags || existingProduct.tags;
      existingProduct.img = imageResult.secure_url || existingProduct.img;
      existingProduct.storeId=existingProduct.storeId;

      // Save the updated store
      await existingStore.save();

      return res.json({ message: "Product updated successfully" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
};

 



