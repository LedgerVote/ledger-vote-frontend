import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Faq from './pages/Faq';
import ContactUs from './pages/ContactUs';
import Example from './pages/Example';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/faq" element={<Faq />}/>
          <Route path="/contactus" element={<ContactUs />}/>
          <Route path="/example" element={<Example />}/>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
