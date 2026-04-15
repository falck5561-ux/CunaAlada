import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const VideoModal = ({ videoModal, setVideoModal }) => {
  return (
    <AnimatePresence>
      {videoModal && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md"
          onClick={() => setVideoModal(null)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()} // Evita que al hacer clic en el video se cierre
          >
            <button 
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full transition-all" 
              onClick={() => setVideoModal(null)}
            >
              <X size={24} />
            </button>
            <iframe 
              className="w-full h-full" 
              src={`https://www.youtube.com/embed/${videoModal.yt}?autoplay=1`} 
              allow="autoplay; encrypted-media" 
              allowFullScreen 
              title="video" 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;