import "./App.css";
import { LandingPage } from "./Pages/LandingPage/LandingPage";
import { SignIn } from "./Pages/SignIn/SignIn";
import { AuthProvider } from "./Hooks/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbarmenu from "./Layouts/Navbar/Navbarmenu";
import { Footer } from "./Layouts/Footer/Footer";
import { ViewCar } from "./Pages/ViewCars/ViewCar";
import { CarDetail } from "./Pages/ViewCars/IndividualCarDetail/CarDetail";
import { ChangePassword } from "./Pages/ChangePassword/ChangePassword";
import { PendingRequest } from "./Pages/PendingRequest/PendingRequest";
import { DamageReport } from "./Pages/DamageReport/DamageReport";
import { UserStatistics } from "./Pages/UserStats/UserStatistics";
import { WrongRoutePage } from "./Components/WrongRoute/WrongRoutePage";

function App() {
  return (
    <>
      <Router basename="/">
        <AuthProvider>
          <Navbarmenu />
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/viewCar" element={<ViewCar />} />
            <Route path="/viewCar/:id" element={<CarDetail />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route path="/PendingRequest" element={<PendingRequest />} />
            <Route path="/DamageReport" element={<DamageReport />} />
            <Route path="/UserStatistics" element={<UserStatistics />} />
            <Route path="*" element={<WrongRoutePage />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
