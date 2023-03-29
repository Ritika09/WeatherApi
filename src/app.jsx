import { useState } from 'preact/hooks'
import WeatherData from './WeatherData'
import './app.css'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <WeatherData />
    </div>
  )
}
