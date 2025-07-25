import AuthGuard from "@/components/custom/AuthGuard"
import PageNotFound from "@/components/custom/NotFoundPage"
import Agents from "@/pages/agents/Agents"
import LandingPage from "@/pages/LandingPage"
import Meetings from "@/pages/meetings/Meetings"
import OAuthCallback from "@/pages/OAuthCallback"
import SignIn from "@/pages/SignIn"
import SignUp from "@/pages/SignUp"
import { Route, Routes } from "react-router-dom"
import Overview from "@/pages/overview/Overview"



function AppRouter() {

  return (
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/overview' element={<AuthGuard><Overview /></AuthGuard>} />
          <Route path='/agents' element={<AuthGuard><Agents /></AuthGuard>} />
          <Route path='/meetings' element={<AuthGuard><Meetings /></AuthGuard>} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/oauth-success' element={<OAuthCallback />} />
          <Route path='/*' element={<PageNotFound />} />
        </Routes>
  )
}

export default AppRouter
