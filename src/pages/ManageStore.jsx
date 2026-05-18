import React, { useEffect, useState } from 'react'
import { getStoreByAdmin } from '../api/firestoreApi';
import DisplayRating from '../components/DisplayRating';
import { useFirebase } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';
import AddNewProduct from '../components/AddNewProduct';
import ProductList from '../components/ProductList';
import OrdersList from '../components/OrdersList';
import Spinner from '../components/Spinner';

function ManageStore() {
    const navigate=useNavigate()
  const [storeData,setStoreData]=useState('')
  const [reload,setReload]=useState(false);
  const [tabActive,setTabActive]=useState(false);
 const {user,loading}= useFirebase();
 const [popupflag,setPopupFlag]=useState(false);

    const closePopup=()=>{
        setPopupFlag(false)
    }

    const reloadList=()=>{
      setReload(true);
    }

  useEffect(()=>{
    fetchStore();

  },[user])

  useEffect(()=>{
    if(!loading){
      if(!(user && user[0]?.userId))
      navigate("/")
    }
  },[user])



  const fetchStore=async()=>{
    try {
     if(user && user[0]?.userId){
        const res=await getStoreByAdmin(user[0]?.userId);
        if(res.length===0){
          navigate("/")
        }
        
        setStoreData(res[0]);
        // console.log(res);
     }
     else{
     
       if(!loading ){
        navigate("/");
       }
     }
    } catch (error) {
      console.log(error);
    }

  }

  if(loading){
    return (<div>
      <Spinner/>
    </div>)
  }
 return (
  <div className="mt-16 min-h-screen bg-[#F8FAFC] pb-10">

    {/* Store Hero Section */}
    <div
      className="w-full py-12 px-4"
      style={{
        background: "linear-gradient(to right, #3B82F6, #F59E0B)",
      }}
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="flex flex-col md:flex-row">

            {/* Store Image */}
            <div className="md:w-[40%] w-full h-[300px]">
              <img
                className="w-full h-full object-cover"
                src={storeData?.storeImage}
                alt="store-img"
              />
            </div>

            {/* Store Details */}
            <div className="flex-1 p-8 flex flex-col justify-between">

              <div>
                <h1 className="text-4xl font-bold text-[#1E3A5F] font-serif mb-4">
                  {storeData?.storeName}
                </h1>

                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {storeData?.storeAddress}
                </p>

                <DisplayRating rating={3} />
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setPopupFlag(true)}
                  className="bg-gradient-to-r from-blue-500 to-amber-500 text-white font-semibold px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Add Product
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Tabs */}
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">

      <div className="max-w-6xl mx-auto px-4">
        <ul className="flex flex-wrap">

          {/* Products Tab */}
          <li>
            <button
              onClick={() => setTabActive(false)}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                !tabActive
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-blue-500"
              }`}
            >
              Products
            </button>
          </li>

          {/* Orders Tab */}
          <li>
            <button
              onClick={() => setTabActive(true)}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                tabActive
                  ? "border-amber-500 text-amber-600 bg-amber-50"
                  : "border-transparent text-gray-500 hover:text-amber-500"
              }`}
            >
              Manage Orders
            </button>
          </li>

        </ul>
      </div>
    </div>

    {/* Main Content */}
    <div className="max-w-6xl mx-auto px-4 py-8">

      {!tabActive && (
        <ProductList
          id={storeData?.id}
          flag={reload}
        />
      )}

      {tabActive && (
        <OrdersList
          id={storeData?.id}
          flag={reload}
        />
      )}

    </div>

    {/* Popup */}
    {popupflag && (
      <Popup
        onClose={closePopup}
        children={
          <AddNewProduct
            storeId={storeData?.id}
            reload={reloadList}
            onClose={closePopup}
          />
        }
      />
    )}
  </div>
)
}
export default ManageStore;