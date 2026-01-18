import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth, SignInButton, UserButton } from "@clerk/clerk-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const Navigation = () => {
  // Use try-catch to handle when outside ClerkProvider
  let isSignedIn = false;
  let isLoaded = true;

  try {
    const auth = useAuth();
    isSignedIn = auth.isSignedIn ?? false;
    isLoaded = auth.isLoaded;
  } catch {
    // Not inside ClerkProvider, use defaults
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 flex items-center justify-between px-6 md:px-12 lg:px-16"
    >
      {/* Logo */}
      <Link to="/" className="text-white text-base md:text-lg font-medium tracking-tight font-body">
        aurion<span className="text-[10px] md:text-xs align-super">®</span>
      </Link>

      {/* Desktop Navigation - Centered */}
      <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-12 lg:gap-16">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
          >
            <motion.span
              className="text-white text-sm lg:text-base font-normal relative group font-body inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
            </motion.span>
          </Link>
        ))}
      </div>

      {/* Auth Section */}
      <div className="flex items-center gap-3">
        {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? (
          isLoaded && isSignedIn ? (
            <>
              <Link to="/dashboard">
                <motion.span
                  className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium font-body hover:bg-white/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dashboard
                </motion.span>
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-white/20",
                  }
                }}
              />
            </>
          ) : (
            <SignInButton mode="modal">
              <motion.button
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium font-body hover:bg-white/90 transition-colors z-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </SignInButton>
          )
        ) : (
          <Link to="/dashboard">
            <motion.span
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium font-body hover:bg-white/90 transition-colors z-50 inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.span>
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;
