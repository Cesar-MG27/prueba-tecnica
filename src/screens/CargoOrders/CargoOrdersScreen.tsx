import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderList } from '@/components/orders/OrderList/OrderList';
import { AppHeader } from '@/components/ui/AppHeader/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState/ErrorState';
import { SearchInput } from '@/components/ui/SearchInput/SearchInput';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import type { TabItem } from '@/components/ui/Tabs/Tabs';
import { useOrders } from '@/hooks/useOrders';
import type { Order } from '@/types/order';
import { filterByOrderNumber } from '@/utils/filterOrders';
import styles from './CargoOrdersScreen.module.css';

type TabId = 'upcoming' | 'completed' | 'past';

const TABS: TabItem<TabId>[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'past', label: 'Past' },
];

export function CargoOrdersScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('upcoming');
  const [query, setQuery] = useState('');

  const { orders, loading, error, refetch } = useOrders();

  // Requisito 1: filtrar las ordenes por numero de orden.
  const visibleOrders = useMemo(() => filterByOrderNumber(orders, query), [orders, query]);

  // Requisito 3: el resumen lleva a la interfaz de detalles de la orden.
  // La orden completa viaja en el state porque el mock de /orders siempre
  // responde lo mismo; el detalle la usa para no mezclar datos de otra orden.
  const handleResume = (order: Order) => {
    navigate(`/orders/${order.id}`, { state: { order } });
  };

  // Requisito 2: al vencer el tiempo el boton se habilita y manda el mensaje.
  const handlePickup = () => {
    console.log('Navegar');
  };

  const renderOrders = () => {
    if (loading) return <Spinner />;
    if (error) return <ErrorState message={error.message} onRetry={refetch} />;
    if (!orders.length) return <EmptyState title="No upcoming orders" />;

    if (!visibleOrders.length) {
      return (
        <EmptyState title="No results" message={`No orders match "${query}"`} icon="search" />
      );
    }

    return <OrderList orders={visibleOrders} onResume={handleResume} onPickup={handlePickup} />;
  };

  return (
    <div className={styles.screen}>
      <AppHeader title="Cargo Orders" onBack={() => navigate(-1)} />

      <div className={styles.toolbar}>
        <Tabs tabs={TABS} activeId={activeTab} onChange={setActiveTab} />
        <SearchInput value={query} onChange={setQuery} />
      </div>

      <main className={styles.content}>
        {activeTab === 'upcoming' ? (
          renderOrders()
        ) : (
          <EmptyState title="Nothing here yet" message="This tab has no endpoint available." />
        )}
      </main>
    </div>
  );
}
