import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';
import MemberLayout from './layouts/MemberLayout';

// Common Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminMemberDetail from './pages/admin/AdminMemberDetail';
import AdminTasks from './pages/admin/AdminTasks';

// Member Pages
import MemberDashboard from './pages/member/MemberDashboard';
import MemberPortfolio from './pages/member/MemberPortfolio';
import MemberTasks from './pages/member/MemberTasks';
import MemberTaskDetail from './pages/member/MemberTaskDetail';

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="members/:id" element={<AdminMemberDetail />} />
          <Route path="tasks" element={<AdminTasks />} />
        </Route>

        {/* Member Routes */}
        <Route path="/member" element={<MemberLayout />}>
          <Route index element={<MemberDashboard />} />
          <Route path="portfolio" element={<MemberPortfolio />} />
          <Route path="tasks" element={<MemberTasks />} />
          <Route path="tasks/:id" element={<MemberTaskDetail />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
