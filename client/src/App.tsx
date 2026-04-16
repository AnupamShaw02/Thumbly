import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GeneratePage from './pages/GeneratePage';
import GalleryPage from './pages/GalleryPage';
import PreviewPage from './pages/PreviewPage';
import ScrollToTop from './components/ScrollToTop';
import { setTokenGetter } from './services/api';

export default function App() {
  const { isLoaded, getToken } = useAuth();

  useEffect(() => {
    setTokenGetter(() => getToken());
  }, [getToken]);

  if (!isLoaded) return <LoadingScreen />;

  return (
    <>
      <ScrollToTop />
      <CustomCursor />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <GeneratePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <GalleryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview/:id"
          element={
            <ProtectedRoute>
              <PreviewPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
