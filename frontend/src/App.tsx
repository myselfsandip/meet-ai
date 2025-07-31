import { BrowserRouter } from "react-router-dom"
import AppRouter from "./routes/AppRouter"
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
