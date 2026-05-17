import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContext from './context/AppContext.jsx';
import Layout from './Layout.jsx';
import './index.css';
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
// Components Imports
import Main from './components/Main.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import AddShop from './components/AddShop.jsx';
import ManageStore from "./components/ManageStore";

// Pages Imports
import StorePage from './pages/StorePage.jsx';
import ViewStore from './pages/ViewStore.jsx';
import ProductPage from './pages/ProductPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import ProductDetails from './pages/ProductDetails';
import AdminShops from './pages/admin/AdminShops';
import Checkout from './pages/Checkout.jsx';

// ✅ Admin Imports
import AdminRoute from './components/AdminRoute.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      
      {/* Home Route */}
      <Route index element={<Main/>}/> 
      
      {/* Auth Routes */}
      <Route path='login' element={<Login/>}/>
      <Route path='signup' element={<SignUp/>}/>
      
      {/* Shop & Product Routes */}
      <Route path='findShop' element={<StorePage/>}/>
      <Route path='Store' element={<ViewStore/>}/>
      <Route path='Shop/product' element={<ProductPage/>}/>
      <Route path='/product/:productId' element={<ProductDetails />} />
      <Route path="/checkout" element={<Checkout />} />
      
      {/* User Routes */}
      <Route path='AddYourShop' element={<AddShop/>}/>
      <Route path='manageStore' element={<ManageStore/>}/>
      <Route path='checkout' element={<OrderPage/>}/>
      <Route path='orders' element={<OrderHistory/>}/>
    
      <Route path="/payment-success" element={<PaymentSuccess />} />
      
      {/* Admin Route 🔐 */}
      <Route path='admin' element={  <AdminRoute><AdminDashboard /></AdminRoute> }/>

      <Route path='admin/shops' element={<AdminRoute><AdminShops /></AdminRoute>} /></Route>
  )
);

function App() {
  return (
    <AuthProvider> 
      <AppContext>
        <RouterProvider router={router}/>
        <ToastContainer autoClose={2000} />
      </AppContext>
    </AuthProvider>
  );
}

export default App;