import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * PrivateRoute - Bảo vệ route yêu cầu đăng nhập
 * Redirect về login nếu chưa đăng nhập
 */
export const PrivateRoute = ({ children, redirectTo = '/login' }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

/**
 * AdminRoute - Bảo vệ route yêu cầu quyền admin
 * Redirect về 404 nếu không phải admin (giả vờ route không tồn tại)
 */
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user?.roles?.some(
    role => role.name === 'ADMIN' || role.name === 'Admin'
  );

  // Redirect to 404 if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};

/**
 * EditorRoute - Bảo vệ route yêu cầu quyền editor hoặc admin
 * Admin có thể truy cập tất cả, Editor chỉ có quyền hạn hẹp hơn
 */
export const EditorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is admin or editor
  const hasEditorAccess = user?.roles?.some(
    role => ['ADMIN', 'Admin', 'EDITOR', 'Editor', 'editor'].includes(role.name)
  );

  // Redirect to 404 if not authenticated or not admin/editor
  if (!isAuthenticated || !hasEditorAccess) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
