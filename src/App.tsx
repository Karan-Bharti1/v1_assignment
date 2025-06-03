import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/login/LoginForm';
import TeamOverview from './components/manager/TeamOverview';
import ProjectForm from './components/manager/ProjectForm';
import AssignmentForm from './components/manager/AssignmentForm';
import MyAssignments from './components/engineer/MyAssignments';
import Profile from './components/engineer/Profile';

function ProtectedRoute({
  children,
  roles
}: {
  children: JSX.Element;
  roles?: string[];
}) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }
  return children;
}

function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4 border-b flex justify-between bg-gray-100">
      <div className="space-x-4">
        <Link to="/" className="font-semibold">
          ERM System
        </Link>
        {user && user.role === 'manager' && (
          <>
            <Link to="/team">Team Overview</Link>
            <Link to="/projects/new">New Project</Link>
            <Link to="/assignments/new">New Assignment</Link>
          </>
        )}
        {user && user.role === 'engineer' && (
          <>
            <Link to="/my-assignments">My Assignments</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <button
            onClick={() => logout()}
            className="text-red-600 font-semibold hover:underline"
          >
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="p-4">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/team"
            element={
              <ProtectedRoute roles={['manager']}>
                <TeamOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <ProtectedRoute roles={['manager']}>
                <ProjectForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments/new"
            element={
              <ProtectedRoute roles={['manager']}>
                <AssignmentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-assignments"
            element={
              <ProtectedRoute roles={['engineer']}>
                <MyAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={['engineer']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to={window.localStorage.getItem('role') === 'manager' ? '/team' : '/my-assignments'} replace />} />
          <Route path="*" element={<div className="text-center mt-20 text-2xl font-bold">404 - Page Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
