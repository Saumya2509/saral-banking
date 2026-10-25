import React from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../../components/shell/Screen';
import ListRow from '../../components/ui/ListRow';
import Card from '../../components/ui/Card';
import StatusTimeline from '../../components/records/StatusTimeline';
import BigButton from '../../components/ui/BigButton';
import Notice from '../../components/ui/Notice';
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  BookIcon,
  CreditCardIcon,
  ShieldIcon,
  UserIcon,
  CheckIcon,
} from '../../components/icons/Icons';
import { useStore } from '../../store/index.js';
import { useI18n } from '../../i18n/index.js';
import { formatDate } from '../../utils/dates.js';
import { getCustomer } from '../../data/customers.js';
import { formatINR } from '../../utils/money.js';

export default function Services() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { lang, t } = useI18n();

  const customerId = state.session.customerId || 'shankar';
  const customer = getCustomer(customerId);
  const overrides = state.records?.contactOverrides || {};

  const activeMobile = overrides.mobile || customer.mobile;
  const activeEmail = overrides.email || customer.email || 'Not provided';
  const activeAddress = overrides.address || (customer.branch?.en ? `${customer.branch.en}, Jammu` : 'Jammu');

  const isCardBlocked = state.records?.cardState?.blocked || false;
  const currentUpiLimit = state.records?.upiLimits?.dailyPaise || 10000000;
  const serviceRequests = state.records?.serviceRequests || [];
  const isYoung = state.settings.mode === 'young';

  const handleAdvanceStatus = (req) => {
    let nextStatus = 'in_progress';
    if (req.status === 'in_progress') nextStatus = 'done';

    dispatch({
      type: 'UPDATE_SERVICE_REQUEST',
      payload: { id: req.id, status: nextStatus },
    });
  };

  return (
    <Screen title={t('rec.services.title') || 'Services'}>
      {/* Services Menu with Live Current States */}
      <div
        style={{
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          overflow: 'hidden',
        }}
      >
        <ListRow
          icon={<PhoneIcon size={20} />}
          title={t('rec.services.updateMobile') || 'Update mobile number'}
          subtitle={`Current: ${activeMobile}`}
          chevron
          onClick={() => navigate('/services/mobile')}
        />
        <ListRow
          icon={<MailIcon size={20} />}
          title={t('rec.services.updateEmail') || 'Update email address'}
          subtitle={`Current: ${activeEmail}`}
          chevron
          onClick={() => navigate('/services/email')}
        />
        <ListRow
          icon={<MapPinIcon size={20} />}
          title={t('rec.services.updateAddress') || 'Update home address'}
          subtitle={`Current: ${activeAddress}`}
          chevron
          onClick={() => navigate('/services/address')}
        />
        {!isYoung && (
          <ListRow
            icon={<BookIcon size={20} />}
            title={t('rec.services.chequeBook') || 'Request cheque book'}
            subtitle="Delivered to registered address in 5-7 days"
            chevron
            onClick={() => navigate('/services/cheque')}
          />
        )}
        <ListRow
          icon={<CreditCardIcon size={20} />}
          title={
            isCardBlocked
              ? t('rec.services.unblockCard') || 'Unblock debit card'
              : t('rec.services.blockCard') || 'Block debit card'
          }
          subtitle={`Status: ${isCardBlocked ? 'Blocked (Payments Stopped)' : 'Active and working'}`}
          chevron
          onClick={() => navigate(isCardBlocked ? '/services/unblock-card' : '/services/block-card')}
        />
        {/* UPI Limits — only shown to young-mode users; standard users have a fixed ₹1,00,000 global cap */}
        {isYoung && (
          <ListRow
            icon={<ShieldIcon size={20} />}
            title="Request UPI daily limit change"
            subtitle={`Current: ${formatINR(state.young?.dailyLimitPaise || currentUpiLimit)} (Requires Mom's Approval)`}
            chevron
            onClick={() => navigate('/services/upi-limits')}
          />
        )}
        {!isYoung && (
          <ListRow
            icon={<UserIcon size={20} />}
            title={t('rec.services.nominee') || 'Add or change nominee'}
            subtitle={
              state.records?.nominee?.name
                ? `Registered: ${state.records.nominee.name} (${state.records.nominee.relationship})`
                : 'Protect your family by registering a nominee'
            }
            chevron
            onClick={() => navigate('/services/nominee')}
          />
        )}
      </div>

      {/* Service Requests Tracker */}
      {serviceRequests.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px' }}>
            Your Service Requests ({serviceRequests.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {serviceRequests.map((req) => {
              const statusSteps = [
                {
                  label: 'Request received & verified',
                  status: 'done',
                  date: formatDate(req.createdAt, lang),
                },
                {
                  label: 'Bank verification',
                  status: req.status === 'done' ? 'done' : req.status === 'in_progress' ? 'current' : 'pending',
                },
                {
                  label: 'Completed & Applied',
                  status: req.status === 'done' ? 'done' : 'pending',
                },
              ];

              const requestedDetail =
                req.details?.inputVal
                  ? req.type === 'upi-limits'
                    ? `New limit: ₹${req.details.inputVal}`
                    : `Requested: ${req.details.inputVal}`
                  : null;

              return (
                <Card key={req.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'capitalize' }}>
                        {req.type.replace('-', ' ')}
                      </div>
                      {requestedDetail && (
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--brand)', marginTop: '2px' }}>
                          {requestedDetail}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Ref: {req.id}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      {req.status === 'done' ? (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <CheckIcon size={12} /> Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAdvanceStatus(req)}
                          style={{
                            fontSize: '0.75rem',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--brand-soft)',
                            color: 'var(--brand)',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                          className="interactive-tap"
                        >
                          Advance status (demo)
                        </button>
                      )}
                    </div>
                  </div>

                  <StatusTimeline steps={statusSteps} />
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </Screen>
  );
}
