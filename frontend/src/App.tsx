import { BrowserRouter, Routes, Route } from "react-router-dom"
function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Test />}></Route>
            <Route path="/signin" element={<Test />}></Route>
            <Route path="/dashboard" element={<Test />}></Route>
            <Route path="/send" element={<Test />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

function Test(){
  return(
    <div>
      "Hi"
    </div>
  )
}
export default App
