import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Register from "./pages/auth/Register";
import { Toaster } from "@/components/ui/sonner";
import Login from "./pages/auth/Login";
import RequireAuth from "./components/CheckAuth";
import Staff from "./pages/staff/Staff";
import CreateOrganization from "./pages/orgSuperAdmin/CreateOrganization";
import ViewAllOrganizations from "./pages/orgSuperAdmin/ViewAllOrganizations";
import ViewArchivedOrganizations from "./pages/orgSuperAdmin/ViewArchivedOrganizations";
import ViewActiveOrganizations from "./pages/orgSuperAdmin/ViewActiveOrganizations";
import AssignOrganizationalAdmin from "./pages/orgSuperAdmin/AssignOrganizationalAdmin";
import RevokeOrganizationalAdmin from "./pages/orgSuperAdmin/RevokeOrganizationalAdmin";
import ViewAllOrganizationAdmins from "./pages/orgSuperAdmin/ViewAllOrganizationAdmins";
import ViewOrganizationAdmin from "./pages/orgSuperAdmin/ViewOrganizationAdmin";
import UpdateOrganizationalAdmin from "./pages/orgSuperAdmin/UpdateOrganizationalAdmin";
import CreateProgram from "./pages/orgAdmin/CreateProgram";
import GetAllOrganizationPrograms from "./pages/orgAdmin/GetAllOrganizationPrograms";
import ViewProgram from "./pages/orgAdmin/ViewProgram";
import Invitations from "./pages/orgAdmin/Invitations";

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
                <a href="/login" className="text-blue-600 underline">
                  Go to Login
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
            <Route
              path="/organization/all"
              element={<ViewAllOrganizations />}
            />
            <Route
              path="/organization/active"
              element={<ViewActiveOrganizations />}
            />
            <Route
              path="/organization/archived"
              element={<ViewArchivedOrganizations />}
            />
            <Route
              path="/organizational_admin/assign"
              element={<AssignOrganizationalAdmin />}
            />
            <Route
              path="/organizational_admin/:organizationId/:adminId/update"
              element={<UpdateOrganizationalAdmin />}
            />
            <Route
              path="/organizational_admin/revoke"
              element={<RevokeOrganizationalAdmin />}
            />
            <Route
              path="organizational_admin/all"
              element={<ViewAllOrganizationAdmins />}
            />
            <Route
              path="organizational_admin/:organizationId/:adminId"
              element={<ViewOrganizationAdmin />}
            />
            <Route path="/program/create" element={<CreateProgram />} />

            <Route path="/programs/" element={<GetAllOrganizationPrograms />} />
            <Route path="program/:id" element={<ViewProgram />} />
            <Route path="/invitations" element={<Invitations />} />
          </Route>

          <Route path="/*" element={<div className="p-4">404 Not Found</div>} />
        </Routes>
        <Toaster richColors position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;
