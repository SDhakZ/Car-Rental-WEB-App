import React, { useContext } from "react";
import { Login } from "./Pages/Login/Login";
import { CarInventory } from "./Pages/Managements/CarInventory/CarInventory";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Hooks/AuthProvider";
import PrivateRoute from "./Hooks/PrivateRoute";
import { IndividualCarDetail } from "./Pages/Managements/CarInventory/IndividualCarDetail";
import { UserManagement } from "./Pages/Managements/UserManagement/UserManagement";
import { OfferManagement } from "./Pages/Managements/OfferManagement/OfferManagement";
import { Managements } from "./Pages/Managements/Managements";
import { RentalManagement } from "./Pages/Managements/RentalManagement/RentalManagement";
import { CarStats } from "./Pages/RentalStatistics/CarStats/CarStats";
import { UserStats } from "./Pages/RentalStatistics/UserStats/UserStats";
import { Home } from "./Pages/Home/Home";
import { RentalStats } from "./Pages/RentalStatistics/RentalStats";
import { RentalHistory } from "./Pages/RentalStatistics/RentalHistory/RentalHistory";
import { CarSales } from "./Pages/RentalStatistics/CarSales/CarSales";
import { PaymentApproval } from "./Pages/PaymentDetails/PaymentApproval/PaymentApproval";
import { DamageRequest } from "./Pages/PaymentDetails/DamageRequest/DamageRequest";
import { AllUsers } from "./Pages/AllUsers/AllUsers";
import { DamagePaymentLogs } from "./Pages/PaymentDetails/DamagePaymentLogs/DamagePaymentLogs";
import { ReturnCar } from "./Pages/PaymentDetails/ReturnCar/ReturnCar";
import { ChangePassword } from "./Pages/AdminStats/ChangePassword/ChangePassword";
import { AdminStats } from "./Pages/AdminStats/AdminStats";
import { Payments } from "./Pages/PaymentDetails/Payments";
import { EmptyDataInfo } from "./Components/EmptyDataInfo/EmptyDataInfo";
import { AuthContext } from "./Hooks/AuthProvider";
import { WrongRoutePage } from "./Components/WrongRoutePage/WrongRoutePage";
function App() {
  const { user } = useContext(AuthContext);
  const role = user && user.role ? user.role : null;
  return (
    <Router basename="/">
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Home />} />
            <Route
              path="/IndividualCarDetail/:id"
              element={<IndividualCarDetail />}
            />
            <Route path="/CarManagement" element={<CarInventory />} />
            <Route path="/Managements" element={<Managements />} />
            {role === "Admin" && (
              <Route path="/UserManagement" element={<UserManagement />} />
            )}
            <Route path="/RentalManagement" element={<RentalManagement />} />
            <Route path="/OfferManagement" element={<OfferManagement />} />
            <Route path="/RentalStats" element={<RentalStats />} />
            <Route path="/RentalHistory" element={<RentalHistory />} />
            <Route path="/CarStats" element={<CarStats />} />
            <Route path="/UserStats" element={<UserStats />} />
            <Route path="/CarSales" element={<CarSales />} />
            <Route path="/PaymentApproval" element={<PaymentApproval />} />
            <Route path="/DamageRequest" element={<DamageRequest />} />
            {role === "Admin" && (
              <Route path="/AllUsers" element={<AllUsers />} />
            )}
            <Route path="/DamagePaymentLogs" element={<DamagePaymentLogs />} />
            <Route path="/ReturnCar" element={<ReturnCar />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route path="/AdminStats" element={<AdminStats />} />
            <Route path="/Payments" element={<Payments />} />
            <Route path="/test" element={<EmptyDataInfo />} />
          </Route>
          <Route exact path="/admin-login" element={<Login />} />
          <Route path="*" element={<WrongRoutePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
