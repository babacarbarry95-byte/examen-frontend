

import './App.css'
import Chambres from "./components/Chambres.tsx";
import Loisirs from './components/Loisirs.tsx';



function App() {
  

  return (
    <div className="min-h-screen bg-black">
      <Chambres/>
      <Loisirs/>
      
    </div>
  )
}

export default App
