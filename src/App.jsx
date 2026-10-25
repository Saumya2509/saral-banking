import { RouterProvider } from 'react-router-dom';
import { StoreProvider, useStore } from './store/index.js';
import { I18nProvider } from './i18n/index.js';
import router from './router.jsx';
import './index.css';

function I18nProviderWrapper({ children }) {
  const { state } = useStore();
  const lang = state?.settings?.lang || 'en';
  return <I18nProvider lang={lang}>{children}</I18nProvider>;
}

function App() {
  return (
    <StoreProvider>
      <I18nProviderWrapper>
        <RouterProvider router={router} />
      </I18nProviderWrapper>
    </StoreProvider>
  );
}

export default App;
