import CTF from "./components/CTF"
import Pala from "./components/Pala"
import { data } from "./data/data"

function App() {


  return (

      <main>
        <Pala/>
        <CTF data={data}/>
      </main>

  )
}

export default App
