// components/AddNewProduct.jsx
import React, { useState, useEffect } from 'react';
import { uploadImage } from '../api/imageHelper';
import Spinner from './Spinner';
import { addProductInStore, updateProductInStore } from '../api/firestoreApi';

function AddNewProduct({ storeId, onClose, reload, productToEdit }) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // Simple States use kar rahe hain taaki pre-fill karna aasaan ho
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState({});

  // ✅ Agar Edit mode hai, to purana data fill karo
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.title);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setImageUrl(productToEdit.imageUrl);
    }
  }, [productToEdit]);

  const handleImageUpload = async () => {
    try {
      if (image) {
        setLoading(true);
        const url = await uploadImage(image);
        setImageUrl(url);
        setLoading(false);
      } else {
        setError({ ...error, image: "Select an image first" });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const validateDetails = () => {
    const errors = {};
    if (name.length < 3) errors.name = "Name too short";
    if (description.length < 5) errors.description = "Description too short";
    if (!price || price <= 0) errors.price = "Invalid price";
    if (!imageUrl) errors.image = "Image is required";
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (loading) return;
    
    if (!validateDetails()) return;

    setLoading(true);
    try {
      const productData = {
        title: name,
        description: description,
        price: price,
        imageUrl: imageUrl,
        storeId: storeId
      };

      if (productToEdit) {
        // 🔄 Update Existing Product
        await updateProductInStore(productToEdit.id, productData);
      } else {
        // ➕ Add New Product
        await addProductInStore(productData);
      }

      setLoading(false);
      reload(); // List refresh karo
      onClose(); // Popup band karo
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 p-4 rounded-lg">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          {productToEdit ? "Edit Product" : "Add New Product"}
        </h1>

        <div className="w-full space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900">Product Image</label>
            <div className="flex flex-row gap-2 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              />
              <button
                onClick={handleImageUpload}
                type="button"
                className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-3 py-2"
              >
                {loading && image ? <Spinner /> : (imageUrl ? "Change" : "Upload")}
              </button>
            </div>
            {imageUrl && <img src={imageUrl} alt="preview" className="h-16 w-16 mt-2 rounded border" />}
            {error.image && <p className="text-red-500 text-xs">{error.image}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900">Title</label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error.name && <p className="text-red-500 text-xs">{error.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900">Description</label>
            <textarea
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error.description && <p className="text-red-500 text-xs">{error.description}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900">Price (₹)</label>
            <input
              type="number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {error.price && <p className="text-red-500 text-xs">{error.price}</p>}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full text-white bg-[#FF5F1F] hover:bg-orange-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {loading && !image ? <Spinner /> : (productToEdit ? "Update Product" : "Add Product")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddNewProduct;