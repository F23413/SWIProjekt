import './App.css'
import Header from "./pages/header/Header.tsx";
import {Routes, Route} from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import NoMatch from "./pages/noMatch/NoMatch.tsx";
import PostUser from "./pages/employee/PostUser.tsx";

function App() {
  return (
    <>
        <Header />
        <Routes >
            <Route path="/" element={<Dashboard/>}></Route>
            <Route path="/employee" element={<PostUser/>}></Route>
            <Route path="*" element={<NoMatch/>}></Route>
        </Routes>
    </>
  );
}

export default App;
