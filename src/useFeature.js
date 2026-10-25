// src/useFeature.js
import { useStore } from './store/index.js';
import { FEATURES, BLOCKED_CONTENT } from './data/features.js';

export function useFeature(key) {
  const { state } = useStore();
  const mode = state?.settings?.mode || 'standard';
  const rule = FEATURES[key]?.[mode] ?? 'never';

  return {
    visible: rule === 'yes',
    tucked: rule === 'tucked',
    needsGuardian: rule === 'guardian',
    hidden: rule === 'never',
    rule,
    mode,
  };
}

export function useIsContentBlocked(type) {
  const { state } = useStore();
  const mode = state?.settings?.mode || 'standard';
  const blockedList = BLOCKED_CONTENT[mode] || [];
  return blockedList.includes(type);
}

export default useFeature;
