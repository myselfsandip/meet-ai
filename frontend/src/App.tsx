import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignIn from "./pages/SignIn"
import LandingPage from "./pages/LandingPage"
import OAuthCallback from "./pages/OAuthCallback"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/oauth-success' element={<OAuthCallback />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
