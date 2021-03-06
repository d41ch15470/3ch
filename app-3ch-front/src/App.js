import { useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BBS from "pages/BBS";
import NotFound from "pages/NotFound";
import Top from "pages/Top";
import UserProvider from "providers/UserProvider";
import Admin from "pages/Admin";
import AdminLogin from "pages/AdminLogin";
import { SnackbarProvider } from "notistack";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseRounded";
import ErrorBoundary from "components/ErrorBoundary";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<BBS />} />
        <Route exact path="/top" element={<Top />} />
        <Route exact path="/admin" element={<Admin />} />
        <Route exact path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

function App() {
  const notistackRef = useRef(null);

  return (
    <ErrorBoundary>
      <SnackbarProvider
        ref={notistackRef}
        action={(key) => (
          <IconButton onClick={() => notistackRef.current.closeSnackbar(key)}>
            <CloseIcon />
          </IconButton>
        )}
        maxSnack={1}
        sx={{ marginTop: "50px" }}
      >
        <UserProvider>
          <AppRouter />
        </UserProvider>
      </SnackbarProvider>
    </ErrorBoundary>
  );
}

export default App;
