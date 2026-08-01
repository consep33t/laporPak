"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AlertContext = createContext();

export function useCustomAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null); 

  const showAlert = useCallback((message) => {
    setAlert({ message, type: 'alert' });
  }, []);

  const showConfirm = useCallback((message, onConfirm) => {
    setAlert({ message, type: 'confirm', onConfirm });
  }, []);

  const showError = useCallback((message) => {
    setAlert({ message, type: 'error' });
  }, []);

  const closeAlert = () => setAlert(null);

  const handleConfirmClick = () => {
    if (alert?.onConfirm) alert.onConfirm();
    closeAlert();
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.showAlert = showAlert;
      window.showError = showError;
      window.showConfirm = showConfirm;
    }
  }, [showAlert, showError, showConfirm]);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, showError }}>
      {children}
      <AnimatePresence>
        {alert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, rotateX: 20 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-full max-w-sm bg-clayPrimary rounded-[2rem] shadow-clay p-6 text-center border-4 border-white/60"
            >
              <div className="text-6xl mb-4 drop-shadow-md">
                {alert.type === 'error' && '🚨'}
                {alert.type === 'confirm' && '🤔'}
                {alert.type === 'alert' && '🔔'}
              </div>
              
              <h3 className={`text-2xl font-black mb-4 drop-shadow-sm ${alert.type === 'error' ? 'text-red-500' : 'text-clayBlue'}`}>
                {alert.type === 'error' ? 'Ups, Ada Masalah!' : alert.type === 'confirm' ? 'Konfirmasi' : 'Pemberitahuan'}
              </h3>
              
              <p className="text-clayText font-bold mb-8 leading-relaxed">
                {alert.message}
              </p>
              
              <div className="flex justify-center gap-4">
                {alert.type === 'confirm' && (
                  <button onClick={closeAlert} className="shadow-clay-btn active:shadow-clay-btn-active bg-gray-200 text-gray-600 font-bold py-3 px-6 rounded-xl transition-all">
                    Batal
                  </button>
                )}
                <button 
                  onClick={alert.type === 'confirm' ? handleConfirmClick : closeAlert} 
                  className={`shadow-clay-btn active:shadow-clay-btn-active text-white font-bold py-3 px-8 rounded-xl transition-all ${alert.type === 'error' ? 'bg-red-500' : 'bg-clayBlue'}`}
                >
                  {alert.type === 'confirm' ? 'Ya, Yakin' : 'Oke, Mengerti!'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
}
