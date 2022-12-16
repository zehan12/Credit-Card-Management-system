import { useState } from 'react'
import './App.css'
import SignIn from './signin/SignIn'
import SignUp from './signup/SignUp'
import AddCard from './addcard/AddCard';
import ADD from './ADD';
import Cards from './cards/cards';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      {/* <SignUp /> */}
      {/* <SignIn /> */}
      {/* <ADD /> */}
      <Cards />
    </div>
  )
}

export default App
