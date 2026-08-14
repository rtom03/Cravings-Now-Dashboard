import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Pos from "./features/pos/Pos";
import Branches from "./features/branches/Branches";
import HomeDashboard from "./features/home/HomeDashboard";
import Home from "./features/home/HomeDashboard";
import Products from "./features/products/Products";
import Orders from "./features/orders/Orders";
import Customers from "./features/customers/Customers";
import Marketting from "./features/marketting/Marketting";
import Reports from "./features/Reports";
import AddOns from "./features/add-ons/AddOns";
import Qa from "./features/qa/Qa";
import Help from "./features/help/Help";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import UserPublicRoute from "./components/layout/UserRoute";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <Routes>
      <Route element={<UserPublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<Home />} />
          <Route path="pos" element={<Pos />} />
          <Route path="branches" element={<Branches />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="marketting" element={<Marketting />} />
          <Route path="reports" element={<Reports />} />
          <Route path="add-ons" element={<AddOns />} />
          <Route path="qa" element={<Qa />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Route>
    </Routes>
  );
}
