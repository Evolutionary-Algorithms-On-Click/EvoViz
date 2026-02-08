import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import VisualizerPage from './pages/VisualizerPage';

const App: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Visualizer Route with dynamic algorithm parameter */}
                <Route path="/visualizer/:algo" element={<VisualizerPage />} />
                
                {/* Fallback to Landing Page */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
};

export default App;
