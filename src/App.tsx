import "./App.css";
import { useTelegram } from "./hooks/useTelegram";
import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import { closeRegistrationModal } from "./store/slices/modal.slice";
import { AdminPanel } from "./components/AdminPanel/AdminPanel";
import { useSocketRedux } from "./hooks/useSocket";
import { useEffect } from "react";
import { RegistrationSwitcher } from "./components/Registration/RegistrationSwitcher/RegistrationSwitcher";
import TelegramChatApp from "./components/Layout/TelegramChatApp";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DebugLogs } from "./components/DebugLogs/DebugLogs";

function App() {
  const { isAuthenticated, user, loading } = useTelegram(); // Добавили loading
  const { currentChatId } = useAppSelector((state) => state.chat);
  const { connect, disconnect } = useSocketRedux();
  const dispatch = useAppDispatch();

  const handleRegistrationClose = () => {
    dispatch(closeRegistrationModal());
  };

  useEffect(() => {
    if (user) {
      const serverUrl =
        process.env.REACT_APP_API_URL || "http://localhost:3001/";
      connect(serverUrl, user, currentChatId);
    }

    return () => {
      disconnect();
    };
  }, [user, currentChatId, connect, disconnect]);

  const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
    const isAdmin = user?.is_admin || user?.id === Number(process.env.REACT_APP_SUPER_ADMIN_ID);
    return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
  };

  // Показываем загрузку пока определяемся с состоянием пользователя
  if (loading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: '#fff',
          backgroundColor: '#0e1621',
          fontSize: '18px'
        }}>
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<TelegramChatApp />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminPanel />
                </ProtectedAdminRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <RegistrationSwitcher onClose={handleRegistrationClose} />
        )}
      </Router>
      <DebugLogs />
    </div>
  );
}

export default App;