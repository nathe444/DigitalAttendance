import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
// Ensure correct path to store
import { store } from "./store/store"; // Or wherever your store is defined
import Register from "./pages/Register"; // Import the Register page
import { Toaster } from "@/components/ui/sonner"; // Import Toaster

function App() {
  return (
    <Provider store={store}>
      <Router>
        {/* Routes */}
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
          <Route path="/*" element={<div className="p-4">404 Not Found</div>} />
        </Routes>
        {/* Toaster for notifications */}
        <Toaster richColors position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;
