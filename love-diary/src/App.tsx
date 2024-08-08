import { FC } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CountdownPage } from './countdown'

const App: FC = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="countdown" element={<CountdownPage />} />
                <Route index element={<CountdownPage />} />
                <Route path="*" element={<CountdownPage />} />
            </Routes>
        </div>
    )
}

export default App
