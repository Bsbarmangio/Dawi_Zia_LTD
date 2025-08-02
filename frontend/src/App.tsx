import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { RawMaterialsPage } from './pages/RawMaterialsPage';
import { AnimalMedicinesPage } from './pages/AnimalMedicinesPage';
import { ContactPage } from './pages/ContactPage';
import { Chatbot } from './components/Chatbot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/raw-materials" element={<RawMaterialsPage />} />
            <Route path="/animal-medicines" element={<AnimalMedicinesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;