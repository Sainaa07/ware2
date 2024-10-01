import React from 'react';
import Sidebar from '../../components/Sidebar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import css from "./style.module.css";
import Orders from '../Orders/index';
import Reports from '../Reports/index';
import Storage from '../Storage/index'
function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main className={css.Main} style={{ marginLeft: 300, marginTop: 50 }}>
          <Routes>
            {/* <Route path="/home" element={<ProductStorageTable />} /> */}
            <Route path="/orders" element={<Orders />} />
            <Route path="/reports" element={<Reports />} />
            <Route path='/storage' element={<Storage />} />
            <Route path="/" element={<Navigate to="/orders" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
