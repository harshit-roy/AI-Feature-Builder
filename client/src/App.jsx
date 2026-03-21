import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import AdminPanel from "./pages/AdminPanel"
import ProtectedRoute from "./routes/ProtectedRoute"
import GeneratedPage from "./pages/GeneratedPage"
import Navbar from "./components/Navbar"
import PreviewPage from "./pages/PreviewPage"
import LandingPage from "./pages/LandingPage"

function AppLayout() {
  const location = useLocation()
  const hideNavbar = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup"

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route path="/preview/:slug" element={<PreviewPage />} />
        <Route path="/live/:slug" element={<GeneratedPage />} />
        <Route path="/generated/:slug" element={<GeneratedPage />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App