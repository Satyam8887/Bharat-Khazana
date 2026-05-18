// pages/ViewStore.jsx
import React, { useEffect, useState } from 'react';
import DisplayRating from '../components/DisplayRating';
import WhatsAppButton from '../components/WhatsAppButton';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { useSearchParams } from 'react-router-dom';
import { getProductsByStoreId, getStoreById } from '../api/firestoreApi';

function ViewStore() {

  const [searchParams] = useSearchParams();

  const storeId = searchParams.get("id");

  const [storeData, setStoreData] = useState(null);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (storeId) {
      loadData();
    }

  }, [storeId]);

  const loadData = async () => {

    setLoading(true);

    try {

      const [storeRes, productsRes] = await Promise.all([
        getStoreById(storeId),
        getProductsByStoreId(storeId)
      ]);

      // 🔥 IMPORTANT: Only allow approved stores
      if (storeRes?.status !== "approved") {

        setStoreData(null);
        setProducts([]);

      } else {

        setStoreData(storeRes);
        setProducts(productsRes);
      }

    } catch (error) {

      console.error("Error loading store data:", error);

    } finally {

      setLoading(false);
    }
  };

  // ⏳ Loading UI
  if (loading) {

    return (

      <div
        className="mt-20 flex justify-center min-h-screen"
        style={{ background: "#FEF3C7" }}
      >
        <Spinner />
      </div>
    );
  }

  // ❌ Not Approved / Not Found
  if (!storeData) {

    return (

      <div
        className="mt-20 text-center text-lg font-medium min-h-screen flex items-center justify-center"
        style={{
          background: "#FEF3C7",
          color: "#DC2626",
        }}
      >
        🚫 This store is not available or not approved yet.
      </div>
    );
  }

  return (

    <div
      className='mt-16 md:px-10 min-h-screen'
      style={{ background: "#FEF3C7" }}
    >

      {/* Store Header */}
      <div
        className='flex flex-col items-center justify-center md:py-10 py-4 shadow-sm'
        style={{
          background: "#FFF8F0",
          borderBottom: "2px solid #F5C89A",
        }}
      >

        <div className='flex flex-col md:flex-row w-[95%] md:w-[70%] gap-6'>

          {/* Store Image */}
          <div
            className='md:w-[40%] w-full h-48 md:h-56'
          >

            <img
              className='rounded-lg h-full w-full object-cover shadow-md'
              style={{
                border: "1px solid #F5C89A",
                boxShadow: "0 6px 18px rgba(180,83,9,0.10)",
              }}
              src={storeData?.storeImage || "https://dummyimage.com/600x400/000/fff"}
              alt='store-img'
            />
          </div>

          {/* Store Info */}
          <div className='w-full py-2 flex flex-col justify-between'>

            <div>

              <div className='flex flex-row items-center justify-between w-full'>

                <h1
                  className='text-3xl font-bold mb-1 capitalize'
                  style={{ color: "#7C2D12" }}
                >
                  {storeData?.storeName}
                </h1>

                <span
                  className='text-xs font-medium px-2.5 py-0.5 rounded'
                  style={{
                    background: "#FEF3C7",
                    color: "#B45309",
                    border: "1px solid #F5C89A",
                  }}
                >
                  Approved
                </span>

              </div>

              <p
                className='text-sm mb-2'
                style={{ color: "#92400E" }}
              >
                {storeData?.storeAddress}, {storeData?.city}
              </p>

              <p
                className='font-medium'
                style={{ color: "#7C2D12" }}
              >
                {products.length} Products Available
              </p>

            </div>

            <div className='w-full flex flex-row items-center justify-between mt-4'>

              <DisplayRating rating={4} />

              <WhatsAppButton
                shopPhone={storeData?.whatsapp || storeData?.mobile}
                product={{ title: storeData?.storeName }}
              />

            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">

        <h2
          className='text-xl font-semibold mb-6 pl-3'
          style={{
            color: "#7C2D12",
            borderLeft: "4px solid #B45309",
          }}
        >
          Products
        </h2>

        {products.length === 0 ? (

          <p
            className="text-center"
            style={{ color: "#92400E" }}
          >
            No products added in this shop yet.
          </p>

        ) : (

          <main className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">

            {products.map((data) => (

              <ProductCard
                data={data}
                key={data.id}
              />

            ))}
          </main>
        )}
      </div>
    </div>
  );
}

export default ViewStore;