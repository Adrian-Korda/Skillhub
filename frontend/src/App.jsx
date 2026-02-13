import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home.jsx';
import Trends from './pages/Trends';
import Companies from './pages/Companies';
import MarketForecast from "./pages/MarketForecast.jsx";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/trends" element={<Trends />} />
                    <Route path="/market-forecast" element={<MarketForecast />} />
                    <Route path="/companies" element={<Companies />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;