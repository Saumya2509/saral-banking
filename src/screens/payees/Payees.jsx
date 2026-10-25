import React from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import ListRow from '../../components/ui/ListRow';
import { UserIcon, PlusIcon } from '../../components/icons/Icons';
import { getPayeesForCustomer } from '../../data/payees.js';
import { useStore } from '../../store/index.js';
import { useT } from '../../i18n/index.js';

export default function Payees() {
  const navigate = useNavigate();
  const { state } = useStore();
  const t = useT();

  const customerId = state.session.customerId || 'shankar';
  const initialPayees = getPayeesForCustomer(customerId);
  const userAdded = state.pay?.payees?.filter((p) => p.customerId === customerId) || [];
  const payees = [...initialPayees, ...userAdded];

  return (
    <Screen
      title={t('payees.title') || 'Payees'}
      mainAction={{
        label: t('payees.addNew') || 'Add new payee',
        onClick: () => navigate('/payees/new'),
        icon: <PlusIcon size={20} />,
      }}
    >
      <div
        style={{
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          overflow: 'hidden',
        }}
      >
        {payees.map((payee) => (
          <ListRow
            key={payee.id}
            icon={<UserIcon size={20} />}
            title={payee.name}
            subtitle={`${payee.bank} · ${payee.accountNumber}`}
            chevron
            onClick={() => navigate('/pay/amount', { state: { payee } })}
          />
        ))}
      </div>
    </Screen>
  );
}
