import { BrowserRouter } from "react-router-dom"
import AppRouter from "./routes/AppRouter"
import { Suspense } from "react"
import CustomLoader from "./components/custom/CustomLoader"
import { Toaster } from "sonner"
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'



function App() {

  return (
    <>
      <BrowserRouter>
        <NuqsAdapter>
          {/* <Suspense fallback={<CustomLoader />}> */}
          <AppRouter />
          {/* Required for sonner to display toasts */}
          <Toaster position="top-right" richColors />
          {/* </Suspense> */}
        </NuqsAdapter>
      </BrowserRouter>
    </>
  )
}

export default App
