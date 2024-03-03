import HomePage from "./pages/HomePage";
import StudentList from "./pages/StudentsList";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/students" element={<StudentList />} />
    </Routes>
  );
}
export default App;
