import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
