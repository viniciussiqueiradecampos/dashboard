import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { FinanceProvider } from './contexts/FinanceContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <FinanceProvider>
            <App />
        </FinanceProvider>
    </React.StrictMode>,
)
