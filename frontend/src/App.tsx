import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import UserDetails from "./pages/Details"
import Dashboard from "./pages/Dashboard"
function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/details" element={<UserDetails />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App
