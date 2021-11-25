import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BBS from "pages/BBS";
import NotFound from "pages/NotFound";
import Top from "pages/Top";
import UserProvider from "providers/UserProvider";
import Admin from "pages/Admin";
import AdminLogin from "pages/AdminLogin";
import { SnackbarProvider } from "notistack";

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
  return (
    <SnackbarProvider maxSnack={2}>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </SnackbarProvider>
  );
}

export default App;
