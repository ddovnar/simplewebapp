import {Route, Routes} from 'react-router-dom'
import BankEditPage from './pages/BankEditPage'
import BankListPage from './pages/BankListPage'
import CalculationPage from './pages/CalculationPage'

export default function Router() {
    return (
        <Routes>
            <Route index element={<BankListPage/>}/>
            <Route path='/' element={<BankListPage/>} />
            <Route path="/bank/:id" element={<BankEditPage />} />
            <Route path="/calc" element={<CalculationPage />} />
        </Routes>
    )
}