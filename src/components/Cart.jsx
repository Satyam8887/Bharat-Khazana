import React, { useEffect, useState } from 'react'
import { useFirebase } from '../context/AppContext'
import cartImage from '../assets/emptyCart.gif'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Cart({onClose}) {
  const {cart, incrementProductQuantity, decrementProductQuantity, removeProduct, user}=useFirebase();
  const [total,setTotal]=useState(0);
  const navigate=useNavigate()

  // console.log("cart",cart);

  useEffect(()=>{
    calculateTotal()
  },[cart]);

  const calculateTotal=()=>{
    let cal=0;
    cart.forEach(element => {
      cal=cal+(element.price*element.quantity);
    });
    setTotal(cal)
  }

  

  const decrement=(prod)=>{
    if(prod.quantity===1)
    removeFromCart(prod.id);
  else
   decrementProductQuantity(prod.id);
  }

  const removeFromCart=(id)=>{
    removeProduct(id);
    toast.success("Removed Successfully !", {
      position: toast.POSITION.TOP_LEFT
    });
  }

  const handleCheckout=()=>{
    if(cart.length!==0){
      if(!user[0]?.id){
        toast.warn("Please login to complete the purchase", {
          position: toast.POSITION.TOP_LEFT
        });
      }
      else{
        navigate("/checkout");
        onClose()
      }
    }
  }

  return (
    <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <div className="fixed inset-0 backdrop-blur-[2px]"></div>
  
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button onClick={onClose} type="button" className="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                      <span className="absolute -inset-0.5"></span>
                      <span className="sr-only">Close panel</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
  
                <div className="mt-8">
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {
                      cart && cart.length===0 && <img src={cartImage}/>
                    }
                    {
                      cart && cart.length!=0 && cart.map((data)=>(
                        <li key={data?.id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img src={data?.imageUrl} alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt." className="h-full w-full  object-center object-scale-down"/>
                        </div>
  
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <a href="#">{data?.title}</a>
                              </h3>
                              <p className="ml-4">&#8377;{data?.price}</p>
                            </div>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="sm:order-1">
                            <div className="mx-auto flex h-8 items-stretch text-gray-600">
                               <button onClick={()=>decrement(data)}  className="flex items-center justify-center rounded-l-md bg-gray-200 px-4 transition hover:bg-black hover:text-white">-</button>
                               <div className="flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition">{data?.quantity}</div>
                               <button onClick={()=>incrementProductQuantity(data?.id)} className="flex items-center justify-center rounded-r-md bg-gray-200 px-4 transition hover:bg-black hover:text-white">+</button>
                             </div>
                           </div>
  
                            <div className="flex">
                              <button onClick={()=>removeFromCart(data.id)} type="button" className="font-medium text-red-600 hover:text-indigo-500">Remove</button>
                            </div>
                          </div>
                        </div>
                      </li>
                      ))
                    }
                     
                    </ul>
                  </div>
                </div>
              </div>
  
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between  text-gray-900">
                  <p>Subtotal</p>
                  <p>&#8377;{total}</p>
                </div>
                <div className="flex justify-between text-xm text-gray-900">
                  <p>Shipping</p>
                  <p>&#8377;0.00</p>
                </div>
                <div className="flex justify-between text-xm font-medium text-gray-900 border-0 border-t border-gray-300 mt-2 pt-1">
                  <p>Total</p>
                  <p>&#8377;{total}</p>
                </div>
               
                <div className="mt-4">
                  <button onClick={()=>handleCheckout()} className="flex items-center justify-center rounded-md border border-transparent bg-[#FF5F1F] px-6 py-3 text-base font-medium text-white shadow-sm hover:scale-105 w-full">Checkout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer autoClose={2000} />
  </div>  
  )
}

export default Cart