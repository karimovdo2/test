import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Survey from './Survey'
import Doctor from './Doctor'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/*" element={<Survey />} />
      </Routes>
    </BrowserRouter>
  )
}
