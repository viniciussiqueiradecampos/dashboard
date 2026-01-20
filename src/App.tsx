import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Placeholder Pages - To be implemented
const DashboardMock = () => <div className="p-8">Dashboard Content</div>;
const GoalsMock = () => <div className="p-8">Goals Content</div>;
const CardsMock = () => <div className="p-8">Cards Content</div>;
const TransactionsMock = () => <div className="p-8">Transactions Content</div>;
const ProfileMock = () => <div className="p-8">Profile Content</div>;

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-neutral-200">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardMock />} />
                    <Route path="/goals" element={<GoalsMock />} />
                    <Route path="/cards" element={<CardsMock />} />
                    <Route path="/transactions" element={<TransactionsMock />} />
                    <Route path="/profile" element={<ProfileMock />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
