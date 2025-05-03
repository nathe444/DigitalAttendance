import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Register from "./pages/auth/Register";
import { Toaster } from "@/components/ui/sonner";
import Login from "./pages/auth/Login";
import RequireAuth from "./components/CheckAuth";
import Staff from "./pages/staff/Staff";
import CreateOrganization from "./pages/orgSuperAdmin/CreateOrganization";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="p-4">
                Home Page -{" "}
                <a href="/register" className="text-blue-600 underline">
                  Go to Register
                </a>
              </div>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/staff" element={<Staff />} />
            <Route
              path="/organization/create"
              element={<CreateOrganization />}
            />
          </Route>
          <Route path="/*" element={<div className="p-4">404 Not Found</div>} />
        </Routes>
        <Toaster richColors position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;
