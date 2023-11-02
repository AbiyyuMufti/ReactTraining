import { useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AuthContext, { TUserContext } from "./Component/Context/AuthProvider";
import Header from "./Component/ReusableComponent/Header";
import LoginPage from "./Page/LoginPage/LoginPage.index";
import Home from "./Page/Home/Home.index";
import NotFound from "./Component/ReusableComponent/NotFound";
import HistoricalCurrency from "./Page/HistoricalCurrency/HistoricalCurrency.index";
import Calendar from "./Page/Calendar/Calendar.index";
import MachineUtilization from "./Page/MachineUtilization/MachineUtilization.index";
import DatePickerTest from "./Page/DatePickerTest/DatePickerTest.index";
import ChatApp from "./Page/ChatApp/ChatApp.index";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

function App() {
  const queryClient = new QueryClient();
  const currentLocation = useLocation();
  const { user } = useContext(AuthContext);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="main-container">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          limit={3}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Header
          useHome={currentLocation.pathname !== "/home"}
          userName={user?.user_name}
        />
        <div className="main-container__body">
          <Router currentUser={user} />
        </div>
      </div>
    </QueryClientProvider>
  );
}

function Router(props: { currentUser: TUserContext | null }) {
  const { currentUser } = props;
  if (currentUser) {
    return (
      <Routes>
        <Route path="/" element={<Navigate replace to="/home"></Navigate>} />
        <Route path="/home" element={<Home />} />
        <Route path="/historical-currency" element={<HistoricalCurrency />} />
        <Route path="/machine-utilization" element={<MachineUtilization />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/chat-box" element={<ChatApp />} />
        <Route path="/date-picker-test" element={<DatePickerTest />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route
          path="/*"
          element={<Navigate replace to="/login-page"></Navigate>}
        />
        <Route path="/login-page" element={<LoginPage />} />
      </Routes>
    );
  }
}

export default App;
