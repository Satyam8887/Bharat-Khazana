import React, { useEffect, useState } from 'react'
import { getProductsByStoreId } from '../api/firestoreApi'

function ProductList({id, flag}) {
    const [products,setProducts]=useState([]); 
    
   useEffect(()=>{
    fetchProducts()
   },[id,flag])
    const fetchProducts=async()=>{
        try {
          if(id){
            const res=await getProductsByStoreId(id);
          setProducts(res);
        //   console.log("gshj",res);
          }
        } catch (error) {
          console.log(error);
        }
      }
  return (
<div className="relative overflow-x-auto sm:rounded-lg bg-white shadow-xl mt-4">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase ">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Product Image
                </th>
                <th scope="col" className="px-6 py-3">
                    Product name
                </th>
                <th scope="col" className="px-6 py-3">
                    Price
                </th>
                <th scope="col" className="px-6 py-3">
                    Edit
                </th>
                <th scope="col" className="px-6 py-3">
                    Remove
                </th>
            </tr>
        </thead>
        <tbody>
            {
                products && products.map((data)=>(
                    <tr key={data?.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">
                    <img className='w-24 h-24 object-scale-down' alt='product-image' src={data?.imageUrl}/>
                </td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {data?.title}
                </th>
                <td className="px-6 py-4">
                &#8377;{data?.price}
                </td>
                <td className="px-6 py-4">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
                <td className="px-6 py-4">
                    <a href="#" className="font-medium text-red-700 hover:underline">Remove</a>
                </td>
            </tr>
                ))
            }
        </tbody>
    </table>
</div>
  )
}

export default ProductList