import { useState } from 'react'
import './App.css'
import SignUp from './signup/SignUp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <SignUp />
    </div>
  )
}

export default App
