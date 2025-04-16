import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<div className="p-4">Home Page</div>} />
            <Route path="/*" element={<div className="p-4">Not Found</div>} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
