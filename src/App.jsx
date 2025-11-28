import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChannelDetail from './components/ChannelDetail';
import VideoDetail from './components/VideoDetail';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { VideoProvider } from './context/VideoContext';
import './styles/theme.css';

function App() {
  return (
    <VideoProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/channel/:id" element={<ChannelDetail />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </VideoProvider>
  );
}

export default App;
