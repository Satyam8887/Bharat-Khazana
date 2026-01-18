import React, { useState } from 'react'
import Spinner from './Spinner';
import { updateOrderStatus } from '../api/firestoreApi';

function Status({id,fetchOrders}) {
    const [status,setStatus]=useState('');
    const [loading,setLoading]=useState(false);

    const updateStatus=async()=>{
        if(!loading){
         setLoading(true);
         const res= await updateOrderStatus(id, status); 
        //  console.log("res",res);
         setLoading(false);
         fetchOrders();
        }
       }
  return (
    <div className='flex flex-row'>
            <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " onChange={(e)=>setStatus(e.target.value)}>
               <option value="In Transit">In Transit</option>
               <option value="delivered">Delivered</option>
               <option value="Out For Delivery">Out For Delivery</option>
               <option value="Cancelled">Cancelled</option>
            </select>
            <button onClick={()=>updateStatus()} className='border border-black px-2 py-1 rounded-r-lg'>{loading?  <Spinner/> : "Update"} </button>
    </div>
  )
}

export default Status