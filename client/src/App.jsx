import { Route, Routes } from "react-router-dom";

// pages
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPostPage";

// custom components imports
import Layout from "./components/Layout";

// context components imports
import  UserContextProvider  from "./components/context/UserContext";

import './css/App.css'

function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path="/" element={ <Layout /> }>
        <Route index element={ <IndexPage /> } />
        <Route path="/login" element ={ <LoginPage /> } />
        <Route path="/register" element ={ <RegisterPage /> } />
        <Route path="/create" element ={ <CreatePostPage /> } />
        <Route path="/post/:id" element ={ <PostPage /> } />
        <Route path="/edit/:id" element ={ <EditPost /> } />
      </Route>
    </Routes>
    </UserContextProvider>
  );
}

export default App
