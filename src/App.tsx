import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Home from "@/components/home";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cookies from "@/pages/Cookies";
import Legal from "@/pages/Legal";
import Dashboard from "@/pages/Dashboard";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import CodeEditor from "@/pages/CodeEditor";
import IntelligentCanvas from "@/pages/IntelligentCanvas";
import AppBuilder from "@/pages/AppBuilder";
import TextEditor from "@/pages/TextEditor";
import AgentAI from "@/pages/AgentAI";
import AurionChat from "@/pages/AurionChat";

// Clerk publishable key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-white font-body">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white/60">Loading...</p>
    </div>
  </div>
);

function App() {
  // If no Clerk key, render without auth
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/code-editor" element={<CodeEditor />} />
          <Route path="/intelligent-canvas" element={<IntelligentCanvas />} />
          <Route path="/app-builder" element={<AppBuilder />} />
          <Route path="/text-editor" element={<TextEditor />} />
          <Route path="/agent-ai" element={<AgentAI />} />
          <Route path="/aurion-chat" element={<AurionChat />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#ffffff",
          colorBackground: "#171717",
          colorText: "#ffffff",
          colorTextSecondary: "#a3a3a3",
          colorInputBackground: "rgba(255,255,255,0.05)",
          colorInputText: "#ffffff",
        },
        elements: {
          formButtonPrimary: "bg-white text-black hover:bg-white/90",
          card: "bg-neutral-900 border border-white/10",
        }
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/code-editor" element={<CodeEditor />} />
          <Route path="/intelligent-canvas" element={<IntelligentCanvas />} />
          <Route path="/app-builder" element={<AppBuilder />} />
          <Route path="/text-editor" element={<TextEditor />} />
          <Route path="/agent-ai" element={<AgentAI />} />
          <Route path="/aurion-chat" element={<AurionChat />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/sign-in/*" element={<SignIn />} />
          <Route path="/sign-up/*" element={<SignUp />} />
        </Routes>
      </Suspense>
    </ClerkProvider>
  );
}

export default App;
