// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Tasks from './pages/tasks/Tasks';
import TaskDetail from './pages/tasks/TaskDetail';
import TaskForm from './pages/tasks/TaskForm';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Navbar from './components/common/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
              <Route path="/tasks/:id" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
              <Route path="/tasks/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
              <Route path="/tasks/edit/:id" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 text-center">
              <p>Task Tracker &copy; {new Date().getFullYear()}</p>
            </div>
          </footer>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} />
    </AuthProvider>
  );
}

export default App;