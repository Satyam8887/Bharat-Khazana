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
    <div className='mt-16 md:px-10 pb-10'>
        <div className='flex flex-col items-center justify-center  md:py-10 py-2 bg-white shadow-xl border-0 border-b-2  border-gray-300'>
      <div className='flex flex-col md:flex-row h-[15%] md:h-[20%] w-[90%] md:w-[60%]  '>
        <div className='md:w-[50%] w-full h-full'>
        <img className='rounded-md h-full w-full' src={storeData?.storeImage} alt='store-img'/>
        </div>
        <div className='w-full py-2 px-4 gap-3'>
          <div className='flex flex-row items-center justify-start w-full '>
            <h1 className='title-font  text-xl  font-medium text-gray-900 mb-2'>{storeData?.storeName}</h1>
          </div>
          <p className='leading-relaxed text-gray-500'>{storeData?.storeAddress} </p>
          
         <div className='w-full flex flex-row items-center justify-between'>
         <DisplayRating rating={3}/>
         <button onClick={()=>setPopupFlag(true)} className="inline-flex text-white bg-[#FF5F1F] border-0 py-2 px-4 focus:outline-none hover:scale-105 rounded text-base">Add Product</button>
         </div>
        </div>
      </div>
    </div>
    

<div className="text-sm font-medium text-center bg-white text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
    <ul className="flex flex-wrap -mb-px">
        <li className="me-2">
            <button onClick={()=>setTabActive(tab=>!tab)}
             className={`inline-block p-4 border-b-2  rounded-t-lg hover:text-gray-600 hover:border-gray-300  shadow-lg ${(!tabActive)? "text-blue-600  border-blue-600": "border-transparent"}`} >Products</button>
        </li>
        <li className="me-2">
            <button onClick={()=>setTabActive(tab=>!tab)} className={`inline-block p-4 border-b-2 ${(tabActive)? "text-blue-600  border-blue-600": ""} rounded-t-lg active shadow-lg`} aria-current="page">Manage Orders</button>
        </li>
       
    </ul>
</div>
  {!tabActive && <ProductList id={storeData?.id} flag={reload}/>}
  {tabActive && <OrdersList id={storeData?.id} flag={reload}/>}
  {popupflag &&  <Popup onClose={closePopup} children={<AddNewProduct storeId={storeData?.id} reload={reloadList} onClose={closePopup}/>}/>}
    </div>
  )
}

export default ManageStore