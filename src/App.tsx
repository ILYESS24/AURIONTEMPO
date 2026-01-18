import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ErrorBoundary } from "@/components/common";
import { ProtectedRoute } from "@/components/auth";
import { getClerkPublishableKey, validateEnv, logEnvInfo } from "@/lib/env";
import { logger, securityLogger } from "@/lib/logger";

// Eager load critical components
import Home from "@/components/home";

// Lazy load non-critical pages for better performance
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Cookies = lazy(() => import("@/pages/Cookies"));
const Legal = lazy(() => import("@/pages/Legal"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const About = lazy(() => import("@/pages/About"));
const Blog = lazy(() => import("@/pages/Blog"));
const Contact = lazy(() => import("@/pages/Contact"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const CodeEditor = lazy(() => import("@/pages/CodeEditor"));
const IntelligentCanvas = lazy(() => import("@/pages/IntelligentCanvas"));
const AppBuilder = lazy(() => import("@/pages/AppBuilder"));
const TextEditor = lazy(() => import("@/pages/TextEditor"));
const AgentAI = lazy(() => import("@/pages/AgentAI"));
const AurionChat = lazy(() => import("@/pages/AurionChat"));

// Clerk publishable key
const CLERK_PUBLISHABLE_KEY = getClerkPublishableKey();

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-white font-body text-center">
      <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white/60 text-sm">Loading...</p>
    </div>
  </div>
);

// Configuration error component for production
const ConfigurationError = () => (
  <div className="min-h-screen bg-black flex items-center justify-center p-6">
    <div className="text-white font-body text-center max-w-md">
      <div className="w-16 h-16 border-2 border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-3">Configuration Error</h1>
      <p className="text-white/60 mb-4">
        The application is not properly configured. Please contact support.
      </p>
      <p className="text-white/40 text-xs">
        Error: Authentication service not configured
      </p>
    </div>
  </div>
);

// Public routes that don't require authentication
const PublicRoutes = () => (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/cookies" element={<Cookies />} />
    <Route path="/legal" element={<Legal />} />
    <Route path="/sign-in/*" element={<SignIn />} />
    <Route path="/sign-up/*" element={<SignUp />} />
  </>
);

// Protected routes that require authentication
const ProtectedRoutes = () => (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/code-editor" element={<CodeEditor />} />
      <Route path="/intelligent-canvas" element={<IntelligentCanvas />} />
      <Route path="/app-builder" element={<AppBuilder />} />
      <Route path="/text-editor" element={<TextEditor />} />
      <Route path="/agent-ai" element={<AgentAI />} />
      <Route path="/aurion-chat" element={<AurionChat />} />
    </Route>
  </>
);

function App() {
  // Validate environment on mount
  useEffect(() => {
    logEnvInfo();
    const { isValid, errors } = validateEnv();
    
    if (!isValid) {
      errors.forEach(error => {
        securityLogger.error('Environment validation failed', { error });
      });
    }
    
    logger.info('Application initialized');
  }, []);

  // In production without auth, show configuration error
  if (!CLERK_PUBLISHABLE_KEY && getEnvConfig().IS_PRODUCTION) {
    securityLogger.error('Authentication not configured in production');
    return <ConfigurationError />;
  }

  // In development without auth, allow demo mode with warning
  if (!CLERK_PUBLISHABLE_KEY) {
    logger.warn('Running in demo mode without authentication');
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {PublicRoutes()}
            {/* In demo mode, these routes are accessible without auth */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/code-editor" element={<CodeEditor />} />
            <Route path="/intelligent-canvas" element={<IntelligentCanvas />} />
            <Route path="/app-builder" element={<AppBuilder />} />
            <Route path="/text-editor" element={<TextEditor />} />
            <Route path="/agent-ai" element={<AgentAI />} />
            <Route path="/aurion-chat" element={<AurionChat />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
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
            {PublicRoutes()}
            {ProtectedRoutes()}
          </Routes>
        </Suspense>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
