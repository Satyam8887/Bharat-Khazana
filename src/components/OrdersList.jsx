import React, { useEffect, useState } from 'react'
import { getOrderListForAdmin } from '../api/firestoreApi';
import Status from './Status';

function OrdersList({id, flag}) {
    const [orders,setOrders]=useState([]);
    

    useEffect(()=>{
        fetchOrders();
    },[id,flag])


    const fetchOrders=async()=>{
        try {
            const res=await getOrderListForAdmin(id);
            setOrders(res);
            // console.log("list",res);
        } catch (error) {
            console.log(error);
        }
    }

   

    

  return (
    <div>
        {orders && orders.length!==0 && orders.map((data)=>(
          <div key={data.id} className='w-full  '>
          <div className='my-3 bg-gray-100 py-2  pl-3 '>
          <p className="text-base dark:text-white xl:text-lg leading-6">{data?.time?.date}({data?.time?.time})</p>
          </div>
          <div  className='flex flex-col md:flex-row items-center justify-between mt-4 border-b border-gray-200 px-2 py-3 shadow-md md:gap-0 gap-3'>
              <div className='w-full md:w-[35%] flex flex-row items-start gap-10'>
                <div className='w-[40%]'>
                <img className="w-full max-h-32 object-scale-down" src={data?.productDetails?.imageUrl} alt="dress" />
                </div>
                <div className='w-[60%]'>
                <h3 className="text-xm  font-semibold leading-6 text-gray-800">{data?.productDetails?.title}</h3>
                <p className="text-sm dark:text-white  leading-6 text-gray-800">Price &#8377;{data?.productDetails?.price}</p>
              <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
              <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{data?.address?.name}, mobile- {data?.address?.mobile} ,{data?.address?.address}</p>
                </div>
                </div>
              </div>
              <div className="w-full md:w-[40%] flex flex-col md:flex-row  justify-between  items-start md:gap-0 gap-3 ">
              <div className='flex flex-row justify-between  md:w-auto
              w-full md:flex-col gap-10  h-full'>
              <p className="text-base dark:text-white xl:text-lg leading-6">Status: <span className="md:text-left text-sm leading-5 text-gray-600">{data?.status}</span></p>
              <Status id={data?.id} fetchOrders={fetchOrders}/>
              </div> 
              <div className='flex flex-row justify-between  md:w-auto
              w-full md:flex-col gap-10  h-full'>
              <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">Q-{data?.productDetails?.quantity}</p>
              </div>
              <div className='flex flex-row justify-between  md:w-auto
              w-full md:flex-col gap-10  h-full'>
              <div>
              {/* <p className="text-sm dark:text-white  leading-6 text-gray-800">Price ${data?.productDetails?.price}</p> */}
              <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">Total &#8377;{(data?.productDetails?.quantity * data?.productDetails?.price)}</p>
              </div>
              <a href={`https://www.google.com/maps/search/${data?.address?.geoLocation?.latitude},+${data?.address?.geoLocation?.longitude}/@${data?.address?.geoLocation?.latitude},${data?.address?.geoLocation?.longitude},13z?entry=ttu`} target='blank'><button className='border border-black px-2 py-1'>Geo Location</button></a>
              </div>
            </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default OrdersList