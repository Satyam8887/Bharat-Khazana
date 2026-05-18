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

  const { cart, user, clearCart } = useFirebase();

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    requestLocationPermission,
    latitude,
    longitude,
    locationPermission
  } = useLocation();

  const nameInput = useFormInput('');

  const mobileInput = useFormInput('');

  const addressInput = useFormInput('');

  useEffect(() => {
    calculateTotal()
  }, [cart]);

  useEffect(() => {

    if (!(user && user[0]?.id)) navigate("/login")

    if (cart?.length === 0) navigate("/")

  }, [user, cart])

  const calculateTotal = () => {

    let cal = 0;

    cart.forEach(element => {
      cal = cal + (element.price * element.quantity);
    });

    setTotal(cal)
  }

  const validateDetails = () => {

    const errors = {}

    if (!validateMobile(mobileInput.value)) {

      errors.mobile = "Invalid Mobile Number";

      mobileInput.setError("Invalid Mobile Number")
    }

    if (nameInput.value.length <= 1) {

      errors.name = "valid name is required";

      nameInput.setError("valid name is required")
    }

    if (addressInput.value.length < 8) {

      errors.password = "Invalid Address."

      addressInput.setError("Invalid address.")
    }

    if (!(latitude && longitude)) {

      errors.location = "allow location"

      toast.warn("Allow location permission!", {
        position: toast.POSITION.TOP_LEFT
      });
    }

    return errors;
  }

  const getTimeStamp = () => {

    const currentDateAndTime = new Date();

    const year = currentDateAndTime.getFullYear();

    const month = currentDateAndTime.getMonth() + 1;

    const day = currentDateAndTime.getDate();

    const hours = currentDateAndTime.getHours();

    const minutes = currentDateAndTime.getMinutes();

    const seconds = currentDateAndTime.getSeconds();

    let date = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`

    let time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`

    return { date: date, time: time }
  }

  const handleCheckout = async () => {

    if (!loading) {

      setLoading(true)

      const errors = validateDetails();

      if (Object.keys(errors).length === 0 && latitude && longitude) {

        try {

          const address = {
            name: nameInput.value,
            mobile: mobileInput.value,
            address: addressInput.value,
            geoLocation: { latitude, longitude },
          }

          await cart.forEach(async (data, index) => {

            let timeStamp = getTimeStamp()

            const res = await createOrder({
              productDetails: data,
              storeId: data.storeId,
              userId: user[0]?.id,
              time: timeStamp,
              address: address,
              status: "ordered"
            })
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

    <div
      className='py-16 min-h-screen'
      style={{ background: "#FEF3C7" }}
    >

      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">

        {/* LEFT SECTION */}
        <div className="px-4 pt-8">

          <p
            className="text-xl font-medium"
            style={{ color: "#7C2D12" }}
          >
            Order Summary
          </p>

          <p
            className="mt-1"
            style={{ color: "#92400E" }}
          >
            Check your items and confirm your order.
          </p>

          <div
            className="mt-8 space-y-3 rounded-lg px-2 py-4 sm:px-6"
            style={{
              background: "#FFF8F0",
              border: "1px solid #F5C89A",
              boxShadow: "0 4px 20px rgba(180,83,9,0.08)",
            }}
          >

            {
              cart && cart.length != 0 && cart.map((data) => (

                <div
                  key={data?.id}
                  className="flex flex-col rounded-lg sm:flex-row"
                  style={{
                    background: "#FFF8F0",
                    border: "1px solid #F5C89A",
                  }}
                >

                  <img
                    className="m-2 h-24 w-28 rounded-md border object-scale-down object-center"
                    style={{
                      borderColor: "#F5C89A",
                      background: "#FEF3C7",
                    }}
                    src={data?.imageUrl}
                    alt=""
                  />

                  <div className="flex w-full flex-col px-4 py-4">

                    <span
                      className="font-semibold"
                      style={{ color: "#7C2D12" }}
                    >
                      {data?.title}
                    </span>

                    <span
                      className="float-right text-sm"
                      style={{ color: "#92400E" }}
                    >
                      Qt-{data?.quantity}
                    </span>

                    <p
                      className="text-lg font-bold"
                      style={{ color: "#B45309" }}
                    >
                      &#8377;{data?.price}
                    </p>

                  </div>
                </div>
              ))
            }
          </div>

          <p
            className="mt-8 text-lg font-medium"
            style={{ color: "#7C2D12" }}
          >
            Payment Method
          </p>

          <form className="mt-5 grid gap-6">

            <div className="relative">

              <input
                className="peer hidden"
                id="radio_2"
                type="radio"
                name="radio"
                checked
                readOnly
              />

              <span
                className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 bg-white"
                style={{
                  borderColor: "#B45309",
                }}
              ></span>

              <label
                className="flex cursor-pointer select-none rounded-lg p-4"
                htmlFor="radio_2"
                style={{
                  border: "2px solid #F5C89A",
                  background: "#FFF8F0",
                }}
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#B45309"
                  className="w-14 h-10"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />

                </svg>

                <div className="ml-5">

                  <span
                    className="mt-2 font-semibold"
                    style={{ color: "#7C2D12" }}
                  >
                    Cash on Delivery
                  </span>

                  <p
                    className="text-sm leading-6"
                    style={{ color: "#92400E" }}
                  >
                    Delivery: 2-4 Days
                  </p>

                </div>
              </label>
            </div>
          </form>
        </div>

        {/* RIGHT SECTION */}
        <div
          className="mt-10 px-4 pt-8 lg:mt-0"
          style={{
            background: "#FFF8F0",
            borderLeft: "1px solid #F5C89A",
          }}
        >

          <p
            className="text-xl font-medium"
            style={{ color: "#7C2D12" }}
          >
            Delivery Address
          </p>

          <p
            style={{ color: "#92400E" }}
          >
            Complete your order by providing address details.
          </p>

          <div className="">

            <div className='mt-4'>

              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium"
                style={{ color: "#7C2D12" }}
              >
                Geo Location
              </label>

              <button
                onClick={() => requestLocationPermission()}
                type="button"
                className="font-medium rounded-lg text-sm px-3 py-2 text-center"
                style={{
                  background:
                    "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
                  color: "#fff",
                }}
              >
                Allow Location
              </button>
            </div>

            {/* Name */}
            <label
              htmlFor="email"
              className="mt-4 mb-2 block text-sm font-medium"
              style={{ color: "#7C2D12" }}
            >
              Name
            </label>

            <div className="relative">

              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-md px-4 py-3 pl-11 text-sm shadow-sm outline-none"
                style={{
                  border: "1px solid #F5C89A",
                  background: "#FEF3C7",
                  color: "#7C2D12",
                }}
                placeholder="your name"
                value={nameInput.value}
                onChange={nameInput.onChange}
              />

              {nameInput.error &&
                <p className='text-red-500 text-xs'>
                  {nameInput.error}.
                </p>
              }

            </div>

            {/* Mobile */}
            <label
              htmlFor="card-holder"
              className="mt-4 mb-2 block text-sm font-medium"
              style={{ color: "#7C2D12" }}
            >
              Mobile Number
            </label>

            <div className="relative">

              <input
                type="tel"
                id="mobile"
                name="mobile"
                className="w-full rounded-md px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none"
                style={{
                  border: "1px solid #F5C89A",
                  background: "#FEF3C7",
                  color: "#7C2D12",
                }}
                placeholder="9196XXXXXX"
                value={mobileInput.value}
                onChange={mobileInput.onChange}
              />

              {mobileInput.error &&
                <p className='text-red-500 text-xs'>
                  {mobileInput.error}.
                </p>
              }

            </div>

            {/* Address */}
            <label
              htmlFor="address"
              className="mt-4 mb-2 block text-sm font-medium"
              style={{ color: "#7C2D12" }}
            >
              Address
            </label>

            <div className="relative">

              <textarea
                value={addressInput.value}
                onChange={addressInput.onChange}
                type="text"
                id="address"
                name="address"
                className="w-full rounded-md px-4 py-3 text-sm uppercase shadow-sm outline-none"
                style={{
                  border: "1px solid #F5C89A",
                  background: "#FEF3C7",
                  color: "#7C2D12",
                }}
                placeholder="address"
              ></textarea>

              {addressInput.error &&
                <p className='text-red-500 text-xs'>
                  {addressInput.error}.
                </p>
              }

            </div>

            {/* Totals */}
            <div
              className="mt-6 border-t border-b py-2"
              style={{
                borderColor: "#F5C89A",
              }}
            >

              <div className="flex items-center justify-between">

                <p
                  className="text-sm font-medium"
                  style={{ color: "#7C2D12" }}
                >
                  Subtotal
                </p>

                <p
                  className="font-semibold"
                  style={{ color: "#7C2D12" }}
                >
                  &#8377;{total}
                </p>

              </div>

              <div className="flex items-center justify-between">

                <p
                  className="text-sm font-medium"
                  style={{ color: "#7C2D12" }}
                >
                  Shipping
                </p>

                <p
                  className="font-semibold"
                  style={{ color: "#7C2D12" }}
                >
                  &#8377;0.00
                </p>

              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">

              <p
                className="text-sm font-medium"
                style={{ color: "#7C2D12" }}
              >
                Total
              </p>

              <p
                className="text-2xl font-semibold"
                style={{ color: "#B45309" }}
              >
                &#8377;{total}
              </p>

            </div>
          </div>

          <button
            onClick={() => handleCheckout()}
            className="mt-4 mb-8 w-full rounded-md px-6 py-3 font-medium text-white"
            style={{
              background:
                "linear-gradient(to right, #7C2D12, #B45309, #F59E0B)",
            }}
          >
            {loading ? "Loading..." : "Place Order"}
          </button>
        </div>
      </div>

      <ToastContainer autoClose={2000} />
    </div>
  )
}

export default OrderPage