// pages/ViewStore.jsx
import React, { useEffect, useState } from 'react';
import DisplayRating from '../components/DisplayRating';
import WhatsAppButton from '../components/WhatsAppButton';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner'; // Spinner import karein
import { useSearchParams } from 'react-router-dom';
import { getProductsByStoreId, getStoreById } from '../api/firestoreApi';

function ViewStore() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("id"); // URL se ID nikala
  
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (storeId) {
      loadData();
    }
  }, [storeId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Dono calls parallel me chalayenge taaki fast ho
      const [storeRes, productsRes] = await Promise.all([
        getStoreById(storeId),
        getProductsByStoreId(storeId)
      ]);

      setStoreData(storeRes);
      setProducts(productsRes);
    } catch (error) {
      console.error("Error loading store data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="mt-20 flex justify-center"><Spinner /></div>;
  }

  if (!storeData) {
    return <div className="mt-20 text-center text-red-500">Store not found!</div>;
  }

  return (
    <div className='mt-16 md:px-10 min-h-screen bg-gray-50'>
      {/* Store Header Section */}
      <div className='flex flex-col items-center justify-center md:py-10 py-4 bg-white shadow-sm border-b border-gray-200'>
        <div className='flex flex-col md:flex-row w-[95%] md:w-[70%] gap-6'>
          
          {/* Store Image */}
          <div className='md:w-[40%] w-full h-48 md:h-56'>
            <img 
              className='rounded-lg h-full w-full object-cover shadow-md' 
              src={storeData?.storeImage || "https://dummyimage.com/600x400/000/fff"} 
              alt='store-img'
            />
          </div>

          {/* Store Info */}
          <div className='w-full py-2 flex flex-col justify-between'>
            <div>
              <div className='flex flex-row items-center justify-between w-full'>
                <h1 className='text-3xl font-bold text-gray-900 mb-1 capitalize'>{storeData?.storeName}</h1>
                <span className='bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded'>Open</span>
              </div>
              <p className='text-gray-500 text-sm mb-2'>{storeData?.storeAddress}, {storeData?.city}</p>
              <p className='text-gray-700 font-medium'>{products.length} Products Available</p>
            </div>

            <div className='w-full flex flex-row items-center justify-between mt-4'>
               <DisplayRating rating={4} /> {/* Rating dynamic kar sakte hain baad me */}
               
               {/* Agar storeData me mobile number ho to pass karein */}
               <WhatsAppButton mobile={storeData?.mobile} /> 
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className='text-xl font-semibold mb-6 text-gray-800 border-l-4 border-[#FF5F1F] pl-3'>Products</h2>
        
        {products.length === 0 ? (
           <p className="text-center text-gray-500">No products added in this shop yet.</p>
        ) : (
          <main className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
            {products.map((data) => (
              <ProductCard data={data} key={data.id} />
            ))}
          </main>
        )}
      </div>
    </div>
  );
}

export default ViewStore;