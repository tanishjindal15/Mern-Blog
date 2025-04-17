import { Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./UserContext";  // ✅ Import User Context
import "./App.css";
import Indexpage from "./Indexpage.jsx";
import Layout from "./Layout.jsx";
import Loginpage from "./Loginpage.jsx";
import Registerpage from "./Registerpage.jsx";
import CreatePost from "./CreatePost.jsx";
import PostPage from "./PostPage.jsx";
import Editpost from "./Editpost.jsx";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Indexpage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/create" element={<CreatePost/>}></Route>
          <Route path="/post/:id" element={<PostPage/>}></Route>
          <Route path="/edit/:id" element={<Editpost/>}></Route>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
