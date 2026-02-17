import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadPDF from "./pages/UploadPDF";
import Chatbot from "./pages/Chatbot"; 
import Flashcards from "./pages/Flashcards"; 


// Layout & Components
import MainLayout from "./layouts/MainLayout";
import AuthSync from "./components/auth/AuthSync";

// Styles
import "./App.css";

function App() {
  return (
    <>
      <SignedIn>
        <AuthSync />
      </SignedIn>

      <Routes>
        {/* 1. PUBLIC ROUTE: Login Page */}
        <Route 
          path="/" 
          element={
            <>
              <SignedOut>
                <Login />
              </SignedOut>
              <SignedIn>
                <Navigate to="/dashboard" />
              </SignedIn>
            </>
          } 
        />

        {/* 2. PRIVATE ROUTE: Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <SignedIn>
              <MainLayout>
                 <Dashboard />
              </MainLayout>
            </SignedIn>
          } 
        />

        {/* 3. PRIVATE ROUTE: Upload Page */}
        <Route 
          path="/upload-pdf" 
          element={
            <SignedIn>
              <MainLayout>
                 <UploadPDF />
              </MainLayout>
            </SignedIn>
          } 
        />

        {/* 4. PRIVATE ROUTE: AI Tutor / Chatbot */}
        <Route 
          path="/chatbot" 
          element={
            <SignedIn>
              <MainLayout>
                 <Chatbot />
              </MainLayout>
            </SignedIn>
          } 
        />

        {/* 5. PRIVATE ROUTE: Flashcards */}
        <Route 
          path="/flashcards" 
          element={
            <SignedIn>
              <MainLayout>
                 <Flashcards />
              </MainLayout>
            </SignedIn>
          } 
        />

        {/* Catch-all: Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;