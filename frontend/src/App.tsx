import { BrowserRouter } from "react-router-dom"
import AppRouter from "./routes/AppRouter"
import { Suspense } from "react"
import CustomLoader from "./components/custom/CustomLoader"
import { Toaster } from "sonner"


function App() {

  return (
    <>
      <BrowserRouter>
        {/* <Suspense fallback={<CustomLoader />}> */}
        <AppRouter />
        {/* Required for sonner to display toasts */}
        <Toaster position="top-right" richColors />
        {/* </Suspense> */}
      </BrowserRouter>
    </>
  )
}

export default App
