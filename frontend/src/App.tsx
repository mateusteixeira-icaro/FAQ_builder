import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index.tsx';
import FAQ from './pages/FAQ.tsx';
import FAQAdmin from './pages/FAQAdmin.tsx';
import NotFound from './pages/NotFound.tsx';
import Feedback from './pages/Feedback.tsx';
import Views from './pages/Views.tsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/faq/admin" element={<FAQAdmin />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/views" element={<Views />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;