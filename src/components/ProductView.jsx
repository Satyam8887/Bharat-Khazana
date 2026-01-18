import React from 'react'
import DisplayRating from './DisplayRating'
import { useFirebase } from '../context/AppContext'
import { toast, ToastContainer } from 'react-toastify';

function ProductView({product}) {
  const {addToCart}=useFirebase();

  const addProductToCart=(data)=>{
    if(data?.id){
      addToCart(data);
    toast.success("Added to cart !", {
      position: toast.POSITION.TOP_LEFT
    });
    }

  }


  return (
    <section className=" font-poppins dark:bg-gray-800">
    <div className="max-w-6xl px-4 mx-auto">
    <div className="flex flex-wrap mb-24 -mx-4">
    <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
    <div className="sticky top-0 overflow-hidden ">
    <div className="relative mb-6 lg:mb-10 lg:h-96">
    <a className="absolute left-0 transform lg:ml-2 top-1/2 translate-1/2" href="#">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-5 h-5 text-blue-500 bi bi-chevron-left dark:text-blue-200" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z">
    </path>
    </svg>
    </a>
    <img className="object-contain w-full lg:h-full" src={product?.imageUrl} alt=""/>
    <a className="absolute right-0 transform lg:mr-2 top-1/2 translate-1/2" href="#">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-5 h-5 text-blue-500 bi bi-chevron-right dark:text-blue-200" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
    </path>
    </svg>
    </a>
    </div>
    </div>
    </div>
    <div className="w-full px-4 md:w-1/2">
    <div className="lg:pl-20">
    <div className="mb-6 ">
    <span className="px-2.5 py-0.5 text-xs text-blue-600 bg-blue-100 dark:bg-gray-700 rounded-xl dark:text-gray-200">New
    Arrival</span>
    <h2 className="max-w-xl mt-6 mb-6 text-xl font-semibold leading-loose tracking-wide text-gray-700 md:text-2xl dark:text-gray-300">
    {product?.title}
    </h2>
    <div className='mb-3'><DisplayRating  rating={5}/></div>
    <p className="inline-block text-2xl font-semibold text-gray-700 dark:text-gray-400 ">
    <span>Rs.{product?.price}</span>
    {/* <span className="ml-3 text-base font-normal text-gray-500 line-through dark:text-gray-400">Rs.10,000.00</span> */}
    </p>
    </div>
    <div className="mb-6">
    <h2 className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-400">Description :</h2>
    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl">
    <p className="text-gray-600 dark:text-gray-400">
    {product?.description}
    </p>
    </div>
    </div>
    <div className="py-6 mb-6 border-t border-b border-gray-200 dark:border-gray-700">
    <span className="text-base text-gray-600 dark:text-gray-400">In Stock</span>
    <p className="text-gray-600 dark:text-gray-400">
    Free shipping all over India
    </p>
    </div>
    <div className="mb-6 "></div>
    <div className="flex gap-4 mb-6">
    <button onClick={()=>addProductToCart(product)}  className="w-full px-4 py-3 text-center text-gray-100 bg-[#FF5F1F] border border-transparent  hover:scale-105   rounded-xl">
    Add to cart</button>
    </div>
    </div>
    </div>
    </div>
    </div>
    <ToastContainer autoClose={2000} />
    </section> 
  )
}

export default ProductView