import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ErrorCard } from './components/cards/ErrorCard.tsx';
import { SuccessCard } from './components/cards/SuccessCard.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/payment-failed" element={<ErrorCard />} />
        <Route path="/payment-success" element={<SuccessCard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
