import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BBS from "pages/BBS";
import NotFound from "pages/NotFound";
import Top from "pages/Top";
import UserProvider from "providers/UserProvider";
import Admin from "pages/Admin";
import AdminLogin from "pages/AdminLogin";

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
    <UserProvider>
      <AppRouter />
    </UserProvider>
  );
}

export default App;
