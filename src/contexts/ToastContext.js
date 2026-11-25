import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import "./ToastContext.css";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setMessage(msg);
    setOpen(true);

    timerRef.current = setTimeout(() => {
      setOpen(false);
      timerRef.current = null;
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {open && (
        <div className="toast" role="status" aria-live="polite">
          {message}
        </div>
      )}

      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
