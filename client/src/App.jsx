import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {Login, Signup, ForgotPassword, ResetPassword} from "./components/Auth/index";
import {Home,Contact,Properties, Aboutus} from './pages/index'

const App = () => {
  return (
    // <HelmetProvider>
    <AuthProvider>
      <Router>
        {/* Base website structured data */}
        {/* <StructuredData type="website" />
        <StructuredData type="organization" /> */}

        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          {/* <Route path="/properties/single/:id" element={<PropertyDetails />} />*/}
        <Route path="/about" element={<Aboutus />} /> 
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/ai-property-hub" element={<AIPropertyHub />} />
        <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
        <Footer />
        <ToastContainer />
      </Router>
    </AuthProvider>
    // </HelmetProvider>
  )
}

export default App;
