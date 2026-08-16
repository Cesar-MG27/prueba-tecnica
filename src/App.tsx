import { Navigate, Route, Routes } from 'react-router-dom';
import { CargoDetailsScreen } from '@/screens/CargoDetails/CargoDetailsScreen';
import { CargoOrdersScreen } from '@/screens/CargoOrders/CargoOrdersScreen';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<CargoOrdersScreen />} />
      <Route path="/orders/:orderId" element={<CargoDetailsScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
