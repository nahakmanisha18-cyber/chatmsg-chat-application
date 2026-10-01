// import './App.css'
import { Route, Routes } from "react-router"
import Header from "./Components/Header"
import ChatMsg from "./pages/ChatMsg"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Messages from "./pages/Messages"
import Groups from "./pages/Groups"
import Contacts from "./pages/Contacts"
import Profile from "./pages/Profile"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<ChatMsg/>} />
        <Route path="/login" element = {<Login/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/message" element={<Messages />} />
        <Route path="/groups" element={<Groups/>}/>
        <Route path="/contacts" element={<Contacts/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>




    </>
  )
}

export default App
