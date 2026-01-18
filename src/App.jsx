import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import AppContext from './context/AppContext.jsx';
import Layout from './Layout.jsx';
import './index.css';

// Components Imports
import Main from './components/Main.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import AddShop from './components/AddShop.jsx';
import ManageStore from "./components/ManageStore"; // ✅ Sahi path (Components folder)

// Pages Imports
import StorePage from './pages/StorePage.jsx';
import ViewStore from './pages/ViewStore.jsx';
import ProductPage from './pages/ProductPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import Vision from './pages/Vision.jsx';
import ProductDetails from './pages/ProductDetails';

// ❌ Removed Duplicate: import ManageStore from './pages/ManageStore.jsx'

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
      
      {/* Protected/User Routes */}
      <Route path='AddYourShop' element={<AddShop/>}/>
      <Route path='manageStore' element={<ManageStore/>}/>
      <Route path='checkout' element={<OrderPage/>}/>
      <Route path='orderHistory' element={<OrderHistory/>}/>
      
      {/* Other Routes */}
      <Route path="vision" element={<Vision />} />
    </Route>
  )
);

function App() {
  return (
    <AppContext>
      <RouterProvider router={router}/>
    </AppContext>
  );
}

export default App;