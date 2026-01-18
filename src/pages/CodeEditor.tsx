import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CodeEditor = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      {/* Header avec bouton retour */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between p-6 border-b border-white/10"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>
        </div>

        <div className="text-white font-body">
          <span className="text-white text-lg font-medium">Code Editor</span>
          <span className="text-white/60 ml-2">aurion®</span>
        </div>

        <div className="w-24" /> {/* Spacer pour centrer le titre */}
      </motion.div>

      {/* Iframe en pleine page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="h-[calc(100vh-80px)]"
      >
        <iframe
          src="https://eed972db.aurion-ide.pages.dev"
          className="w-full h-full border-0"
          title="Aurion IDE"
          allow="clipboard-read; clipboard-write"
        />
      </motion.div>
    </div>
  );
};

export default CodeEditor;