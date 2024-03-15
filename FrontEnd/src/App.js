
import './App.css';
import Login from './Components/Login';
import { Routes, Route } from "react-router-dom";
import ManagerPage from './Pages/ManagerPage'
import MainPage from './Pages/MainPage';
import SettingPage from './Pages/SettingPage';
import StafPage from './Pages/StaffPage';
import HousePage from './Pages/HousePage';
import ServicePage from './Pages/ServicePage';
import JobPage from './Pages/JobPage';
import ElectricPage from './Pages/ElectricPage';
import WaterPage from './Pages/WaterPage';
import ArisePage from './Pages/ArisePage';
import DepositPage from './Pages/DepositPage';
import SpendPage from './Pages/SpendPage';
import RecievePage from './Pages/RecievePage';
import AssetPage from './Pages/AssetPage';
import RentPage from './Pages/RentPage';
import Report_money from './Pages/Report_money';
import Report_guess from './Pages/Report_guess';
import Report_roomNotDone from './Pages/Report_roomNotDone';
import Report_contractEndSoon from './Pages/Report_contractEndSoon';
import ContractPage from './Pages/ContractPage';
function App() {
  return (
    <>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route element={<ManagerPage />}>
            <Route path='/' element={<MainPage />}>
              <Route path='/setting' element={<SettingPage />} />
              <Route path='/staff' element={<StafPage />} />
              <Route path='/house' element={<HousePage />} />
              <Route path='/service' element={<ServicePage />} />
              <Route path='/job' element={<JobPage />} />
              <Route path='/electric' element={<ElectricPage />} />
              <Route path='/water' element={<WaterPage />} />
              <Route path='/arise' element={<ArisePage />} />
              <Route path='/deposit' element={<DepositPage />} />
              <Route path='/spend' element={<SpendPage />} />
              <Route path='/recieve' element={<RecievePage />} />
              <Route path='/asset' element={<AssetPage />} />
              <Route path='/rent' element={<RentPage />} />
              <Route path='/report_money' element={<Report_money />} />
              <Route path='/report_guess' element={<Report_guess />} />
              <Route path='/report_roomNotDone' element={<Report_roomNotDone />} />
              <Route path='/report_contractEndSoon' element={<Report_contractEndSoon />} />
              <Route path='/contract' element={<ContractPage />} />
            </Route>
          </Route>  
        </Routes>
    </>
  );
}

export default App;
