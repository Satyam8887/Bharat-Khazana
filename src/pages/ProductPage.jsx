import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProductById } from '../api/firestoreApi';
import ProductView from '../components/ProductView';


function ProductPage() {
  const [searchParms]=useSearchParams();
  const productId=searchParms.get("id"); 
  const [product,setProduct]=useState('');

  useEffect(()=>{
    fetchProduct();

  },[productId])

  const fetchProduct=async()=>{
    try {
      const res=await getProductById(productId);
      setProduct(res);
      // console.log(product);
    } catch (error) {
      console.log(error);
    }

  }

 

  return (  
    <div className='py-16 mt-10'>
     {product?.id &&  <ProductView product={product}/>}
    </div>
  )
}

export default ProductPage