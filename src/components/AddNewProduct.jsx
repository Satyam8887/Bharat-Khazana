// components/AddNewProduct.jsx
import React, { useState, useEffect } from 'react';
import { uploadImage } from '../api/imageHelper';
import Spinner from './Spinner';
import { addProductInStore, updateProductInStore } from '../api/firestoreApi';

function AddNewProduct({ storeId, onClose, reload, productToEdit }) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // ✅ FIXED: Track upload phase separately from submit phase so the
  // spinner shows correctly for both actions without ambiguity.
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState({});
  const [inStock, setInStock] = useState(true);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.title);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setImageUrl(productToEdit.imageUrl);
      setInStock(productToEdit.inStock !== false);
    }
  }, [productToEdit]);

  const handleImageUpload = async () => {
    if (!image) {
      setError((prev) => ({ ...prev, image: "Select an image first" }));
      return;
    }
    try {
      // ✅ FIXED: Use separate `uploading` state for the upload button spinner
      // so it doesn't interfere with the submit button's loading state.
      setUploading(true);
      const url = await uploadImage(image);
      setImageUrl(url);
      setError((prev) => ({ ...prev, image: "" }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
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
    if (loading || uploading) return;
    if (!validateDetails()) return;

    setLoading(true);
    try {
      const productData = {
        title: name,
        description: description,
        price: price,
        imageUrl: imageUrl,
        storeId: storeId,
        inStock: inStock,
      };

      if (productToEdit) {
        await updateProductInStore(productToEdit.id, productData);
      } else {
        await addProductInStore(productData);
      }

      reload();
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
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
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  // ✅ Reset imageUrl when a new file is picked so the
                  // upload button goes back to "Upload" state correctly.
                  setImageUrl("");
                }}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
              />
              <button
                onClick={handleImageUpload}
                type="button"
                disabled={uploading}
                className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-3 py-2 disabled:opacity-60"
              >
                {/* ✅ FIXED: Now correctly shows spinner during upload only */}
                {uploading ? <Spinner /> : imageUrl ? "Change" : "Upload"}
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

          {/* Out of Stock Toggle */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Stock Status</p>
              <p className="text-xs text-gray-500">
                {inStock ? "Product is available for customers" : "Product is hidden as out of stock"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setInStock((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                inStock ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  inStock ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="text-center text-xs font-semibold">
            {inStock
              ? <span className="text-green-600">✔ In Stock</span>
              : <span className="text-red-500">✘ Out of Stock</span>
            }
          </p>

          {/* Submit Button */}
          {/* ✅ FIXED: Previously `loading && !image` was wrong — after image upload,
              `image` is still truthy so the spinner never showed on submit.
              Now simply uses `loading` (submit phase) independently. */}
          <button
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="w-full text-white bg-[#FF5F1F] hover:bg-orange-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-60"
          >
            {loading
              ? <Spinner />
              : productToEdit ? "Update Product" : "Add Product"
            }
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddNewProduct;
