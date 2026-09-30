import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import EventDetail from './pages/EventDetail.jsx';
import SeatSelect from './pages/SeatSelect.jsx';
import Checkout from './pages/Checkout.jsx';
import Confirmation from './pages/Confirmation.jsx';
import MyTickets from './pages/MyTickets.jsx';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/browse/:category" element={<Browse />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/event/:id/seats" element={<SeatSelect />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation/:id" element={<Confirmation />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}
