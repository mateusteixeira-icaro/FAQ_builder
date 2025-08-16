import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index.tsx';
import FAQ from './pages/FAQ.tsx';
import FAQAdmin from './pages/FAQAdmin.tsx';
import NotFound from './pages/NotFound.tsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/faq/admin" element={<FAQAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;