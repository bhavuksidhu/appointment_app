import React from 'react';
import { BrowserRouter, BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Header from './components/Header';
import PatientList from './components/PatientList';
import "./App.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <ToastContainer theme="light" />
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/" exact element={<PatientList/>} />
          {/* <Route path="/add-patient" element={<AddPatientForm/>} /> */}
        </Routes>
      </div>
    </BrowserRouter>
    </>
  );
}

export default App;
