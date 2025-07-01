import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignIn from "./pages/SignIn"
import LandingPage from "./pages/LandingPage"
import OAuthCallback from "./pages/OAuthCallback"
import SignUp from "./pages/SignUp"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/oauth-success' element={<OAuthCallback />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
