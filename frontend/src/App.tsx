import { BrowserRouter } from "react-router-dom"
import AppRouter from "./routes/AppRouter"
import { Suspense } from "react"
import CustomLoader from "./components/custom/CustomLoader"


function App() {

  return (
    <>
      <BrowserRouter>
        {/* <Suspense fallback={<CustomLoader />}> */}
          <AppRouter />
        {/* </Suspense> */}
      </BrowserRouter>
    </>
  )
}

export default App
