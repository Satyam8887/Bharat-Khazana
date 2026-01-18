import React, { useEffect, useState } from 'react'
import { useFirebase } from '../context/AppContext'
import validateMobile from '../helper/mobileReges';
import useFormInput from '../hooks/useFormInput';
import useLocation from '../hooks/useLocation';
import { createOrder } from '../api/firestoreApi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function OrderPage() {
  const {cart, user, clearCart}=useFirebase(); 
  const [total,setTotal]=useState(0); 
  const [loading,setLoading]=useState(false); 
  const navigate=useNavigate();
  const {requestLocationPermission, latitude, longitude, locationPermission}=useLocation();


  const nameInput=useFormInput('');
  const mobileInput=useFormInput('');
  const addressInput=useFormInput('');



  useEffect(()=>{
    calculateTotal()
  },[cart]);

  useEffect(()=>{
    if(!(user && user[0]?.id)) navigate("/login")
    if(cart?.length===0) navigate("/")
  },[user, cart])

  

   
  const calculateTotal=()=>{
    let cal=0;
    cart.forEach(element => {
      cal=cal+(element.price*element.quantity);
    });
    setTotal(cal)
  }

  const validateDetails=()=>{
    const errors={}
    if(!validateMobile(mobileInput.value)) {
     errors.mobile="Invalid Mobile Number";
     mobileInput.setError("Invalid Mobile Number")
    }
    if(nameInput.value.length<=1) {
     errors.name="valid name is required";
     nameInput.setError("valid name is required")
    }
    if(addressInput.value.length<8){
     errors.password="Invalid Address."
     addressInput.setError("Invalid address.")
    }
    if(!(latitude && longitude)){
      errors.location="allow location"
      toast.warn("Allow location permission!", {
        position: toast.POSITION.TOP_LEFT
      });
    }

    return errors;
}

  const getTimeStamp=()=>{
    const currentDateAndTime = new Date();

    const year = currentDateAndTime.getFullYear();
    const month = currentDateAndTime.getMonth() + 1; // Months are zero-based
    const day = currentDateAndTime.getDate();
    const hours = currentDateAndTime.getHours();
    const minutes = currentDateAndTime.getMinutes();
    const seconds = currentDateAndTime.getSeconds();

    // Format the components into a string
   let date=`${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
   let time=`${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`

   return {date: date, time: time}
  }
  
  const handleCheckout=async()=>{
   if(!loading){
    setLoading(true)
   const errors= validateDetails();
   if(Object.keys(errors).length===0  && latitude && longitude){
      try {
        const address={
          name: nameInput.value,
          mobile: mobileInput.value,
          address: addressInput.value,
          geoLocation: {latitude,longitude},
        }
        await cart.forEach(async(data,index)=>{
          let timeStamp=getTimeStamp()
          const res=await createOrder({productDetails: data, storeId: data.storeId, userId: user[0]?.id, time: timeStamp, address: address, status: "ordered"})
          // console.log("res",index,res);
        })
        clearCart();
        navigate("/orderHistory")
        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
   }
   setLoading(false)
  }
  }

  return (
   <div className='py-16'>
<div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
  <div className="px-4 pt-8">
    <p className="text-xl font-medium">Order Summary</p>
    <p className="text-gray-400">Check your items. And select a suitable payment method.</p>
    <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
     {
      cart && cart.length!=0 &&  cart.map((data)=>(
        <div key={data?.id} className="flex flex-col rounded-lg bg-white sm:flex-row">
        <img className="m-2 h-24 w-28 rounded-md border object-scale-down object-center" src={data?.imageUrl} alt="" />
        <div className="flex w-full flex-col px-4 py-4">
          <span className="font-semibold">{data?.title}</span>
          <span className="float-right text-gray-400">Qt-{data?.quantity}</span>
          <p className="text-lg font-bold">&#8377;{data?.price}</p>
        </div>
      </div>
      ))
     }
    </div>

    <p className="mt-8 text-lg font-medium">Payment Methods</p>
    <form className="mt-5 grid gap-6">
      <div className="relative">
        <input className="peer hidden" id="radio_2" type="radio" name="radio" checked readOnly />
        <span className="peer-checked:border-[#50C878] absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
        <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" htmlFor="radio_2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
          <div className="ml-5">
            <span className="mt-2 font-semibold">Cash on Delivery</span>
            <p className="text-slate-500 text-sm leading-6">Delivery: 2-4 Days</p>
          </div>
        </label>
      </div>
    </form>
  </div>
  <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
    <p className="text-xl font-medium">Delivery Address</p>
    <p className="text-gray-400">Complete your order by providing address details.</p>
    <div className="">
      <div className='mt-4'>
          <label htmlFor="location"  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Geo Location</label>
            <button onClick={()=>requestLocationPermission()} type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-lg text-sm px-2 py-1 text-center me-2 mb-2">Allow Location</button>
       </div>
      <label htmlFor="email" className="mt-4 mb-2 block text-sm font-medium">name</label>
      <div className="relative">
        <input type="text" id="name" name="name" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="your name" value={nameInput.value} onChange={nameInput.onChange} />
        {nameInput.error && <p className='text-red-500 text-xs'>{nameInput.error}.</p>}
        <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </div>
      </div>
      <label htmlFor="card-holder" className="mt-4 mb-2 block text-sm font-medium">Mobile Number</label>
      <div className="relative">
        <input type="tel" id="mobile" name="mobile" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="9196XXXXXX" value={mobileInput.value} onChange={mobileInput.onChange} />
        {mobileInput.error && <p className='text-red-500 text-xs'>{mobileInput.error}.</p>}
        <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
          </svg>
        </div>
      </div>
      <label htmlFor="address" className="mt-4 mb-2 block text-sm font-medium">Address</label>
      <div className="relative">
        <textarea value={addressInput.value} onChange={addressInput.onChange} type="text" id="address" name="address" className="w-full rounded-md border border-gray-200 px-4 py-3  text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="address" ></textarea>
        {addressInput.error && <p className='text-red-500 text-xs'>{addressInput.error}.</p>}
      </div>
      <div className="mt-6 border-t border-b py-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">Subtotal</p>
          <p className="font-semibold text-gray-900">&#8377;{total}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">Shipping</p>
          <p className="font-semibold text-gray-900">&#8377;0.00</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">Total</p>
        <p className="text-2xl font-semibold text-gray-900">&#8377;{total}</p>
      </div>
    </div>
    <button onClick={()=>handleCheckout()} className="mt-4 mb-8 w-full rounded-md bg-[#FF5F1F] px-6 py-3 font-medium text-white">{loading? "Loading..." : "Place Order" }</button>
  </div>
</div>
<ToastContainer autoClose={2000} />
   </div>
  )
}

export default OrderPage