import React, { useEffect, useState } from 'react'
import { getProductsByStoreId } from '../api/firestoreApi'

function ProductList({ id, flag }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
  }, [id, flag])

  const fetchProducts = async () => {
    try {
      if (id) {
        const res = await getProductsByStoreId(id);
        setProducts(res);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="relative overflow-x-auto sm:rounded-lg shadow-xl mt-4"
      style={{
        background: "#FFF8F0",
        border: "1px solid #F5C89A",
        boxShadow: "0 8px 24px rgba(180,83,9,0.08)",
      }}
    >

      <table className="w-full text-sm text-left rtl:text-right">

        <thead
          className="text-xs uppercase"
          style={{
            background: "#FEF3C7",
            color: "#7C2D12",
          }}
        >

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
            products && products.map((data) => (

              <tr
                key={data?.id}
                style={{
                  background: "#FFF8F0",
                  borderBottom: "1px solid #F5C89A",
                }}
              >

                <td className="px-6 py-4">

                  <div
                    className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center"
                    style={{
                      background: "#FEF3C7",
                      border: "1px solid #F5C89A",
                    }}
                  >

                    <img
                      className='w-24 h-24 object-scale-down'
                      alt='product-image'
                      src={data?.imageUrl}
                    />

                  </div>
                </td>

                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                  style={{ color: "#7C2D12" }}
                >
                  {data?.title}
                </th>

                <td
                  className="px-6 py-4 font-semibold"
                  style={{ color: "#B45309" }}
                >
                  &#8377;{data?.price}
                </td>

                <td className="px-6 py-4">

                  <a
                    href="#"
                    className="font-medium hover:underline"
                    style={{ color: "#B45309" }}
                  >
                    Edit
                  </a>

                </td>

                <td className="px-6 py-4">

                  <a
                    href="#"
                    className="font-medium hover:underline text-red-700"
                  >
                    Remove
                  </a>

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