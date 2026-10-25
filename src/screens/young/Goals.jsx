import React, { useState } from 'react';
import Screen from '../../components/shell/Screen';
import Card from '../../components/ui/Card';
import Field from '../../components/ui/Field';
import BigButton from '../../components/ui/BigButton';
import Amount from '../../components/ui/Amount';
import Sheet from '../../components/ui/Sheet';
import { PlusIcon } from '../../components/icons/Icons';
import { rupeesToPaise } from '../../utils/money.js';
import { useStore } from '../../store/index.js';
import { useT } from '../../i18n/index.js';

export default function Goals() {
  const { state, dispatch } = useStore();
  const t = useT();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetRupees, setTargetRupees] = useState('');

  const goals = state.young?.goals || [
    { id: 'goal_1', name: 'New Bicycle', targetPaise: 500000, savedPaise: 350000 },
    { id: 'goal_2', name: 'Science Books', targetPaise: 150000, savedPaise: 150000 },
  ];

  const handleAddGoal = () => {
    if (!goalName.trim() || !targetRupees) return;
    const targetPaise = rupeesToPaise(targetRupees);
    const newGoal = {
      id: `goal_${Date.now()}`,
      name: goalName.trim(),
      targetPaise,
      savedPaise: 0,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
    setGoalName('');
    setTargetRupees('');
    setIsSheetOpen(false);
  };

  return (
    <Screen
      title={t('young.goals.title') || 'Savings goals'}
      mainAction={{
        label: t('young.goals.add') || 'Add a savings goal',
        icon: <PlusIcon size={20} />,
        onClick: () => setIsSheetOpen(true),
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.savedPaise / goal.targetPaise) * 100));
          const isComplete = percent >= 100;

          return (
            <Card key={goal.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '1.0625rem' }}>{goal.name}</span>
                {isComplete && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--success)',
                      backgroundColor: '#ecfdf5',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    Goal Achieved! 🎉
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Saved: <Amount paise={goal.savedPaise} /></span>
                <span>Target: <Amount paise={goal.targetPaise} /></span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  height: '10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--border)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percent}%`,
                    backgroundColor: isComplete ? 'var(--success)' : 'var(--brand)',
                    borderRadius: '9999px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>
                {percent}% saved
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Goal Bottom Sheet */}
      <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="Create a Savings Goal">
        <Field
          label="What are you saving for?"
          placeholder="e.g. Cricket Kit"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />
        <Field
          label="Target Amount (₹)"
          placeholder="2000"
          type="number"
          value={targetRupees}
          onChange={(e) => setTargetRupees(e.target.value)}
        />
        <div style={{ marginTop: '16px' }}>
          <BigButton variant="primary" onClick={handleAddGoal}>
            Save goal
          </BigButton>
        </div>
      </Sheet>
    </Screen>
  );
}
