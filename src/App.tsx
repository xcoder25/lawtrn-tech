import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { PageLoader } from './components/ui/LoadingSpinner';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Projects from './pages/public/Projects';
import ProjectDetail from './pages/public/ProjectDetail';
import Research from './pages/public/Research';
import LearningHub from './pages/public/LearningHub';
import Community from './pages/public/Community';
import Blog from './pages/public/Blog';
import BlogPost from './pages/public/BlogPost';
import Team from './pages/public/Team';
import Contact from './pages/public/Contact';

import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import ManageResearch from './pages/admin/ManageResearch';
import ManagePosts from './pages/admin/ManagePosts';
import ManageLearningHub from './pages/admin/ManageLearningHub';
import ManageTeam from './pages/admin/ManageTeam';
import ManageCommunity from './pages/admin/ManageCommunity';
import ManageNewsletter from './pages/admin/ManageNewsletter';
import ManageContacts from './pages/admin/ManageContacts';
import Analytics from './pages/admin/Analytics';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/research" element={<Research />} />
        <Route path="/learning" element={<LearningHub />} />
        <Route path="/community" element={<Community />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="research" element={<ManageResearch />} />
        <Route path="posts" element={<ManagePosts />} />
        <Route path="learning" element={<ManageLearningHub />} />
        <Route path="team" element={<ManageTeam />} />
        <Route path="community" element={<ManageCommunity />} />
        <Route path="contacts" element={<ManageContacts />} />
        <Route path="newsletter" element={<ManageNewsletter />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}
