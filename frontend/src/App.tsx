import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignIn from "./pages/SignIn"
import LandingPage from "./pages/LandingPage"
import OAuthCallback from "./pages/OAuthCallback"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import AuthGuard from "./components/custom/AuthGuard"
import PageNotFound from "./pages/PageNotFound"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/oauth-success' element={<OAuthCallback />} />
          <Route path='/*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
