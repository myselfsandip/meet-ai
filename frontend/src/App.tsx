import { BrowserRouter } from "react-router-dom"
import AppRouter from "./routes/AppRouter"
import { Toaster } from "sonner"
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { Suspense } from "react"
import CustomLoader from "./components/custom/CustomLoader"


function App() {
  return (
    <>
      <BrowserRouter>
        <NuqsAdapter>
          <Suspense fallback={<CustomLoader />}>
          <AppRouter />
          <Toaster position="top-right" richColors />
          </Suspense>
        </NuqsAdapter>
      </BrowserRouter>
    </>
  )
}

export default App
