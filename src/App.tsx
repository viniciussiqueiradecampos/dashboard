import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

// Placeholder Pages - To be real components soon
const DashboardMock = () => (
    <div>
        <h1 className="text-heading-lg font-bold text-neutral-900 mb-4">Dashboard</h1>
        <p className="text-neutral-600">Conteúdo do Dashboard aqui...</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-40 bg-white rounded-2xl shadow-sm border border-neutral-300 p-6 flex items-center justify-center">Card 1</div>
            <div className="h-40 bg-white rounded-2xl shadow-sm border border-neutral-300 p-6 flex items-center justify-center">Card 2</div>
            <div className="h-40 bg-white rounded-2xl shadow-sm border border-neutral-300 p-6 flex items-center justify-center">Card 3</div>
        </div>
    </div>
);
const GoalsMock = () => <div className="text-heading-md font-bold">Objetivos</div>;
const CardsMock = () => <div className="text-heading-md font-bold">Cartões</div>;
const TransactionsMock = () => <div className="text-heading-md font-bold">Transações</div>;
const ProfileMock = () => <div className="text-heading-md font-bold">Perfil</div>;

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardMock />} />
                    <Route path="/goals" element={<GoalsMock />} />
                    <Route path="/cards" element={<CardsMock />} />
                    <Route path="/transactions" element={<TransactionsMock />} />
                    <Route path="/profile" element={<ProfileMock />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
