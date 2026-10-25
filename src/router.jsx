import { createBrowserRouter } from 'react-router-dom';
import AppShell from './components/shell/AppShell';

// Splash & Auth screens
import SplashScreen from './screens/splash/SplashScreen';
import SignIn from './screens/signin/SignIn';

// Core screens
import Home from './screens/home/Home';
import Accounts from './screens/accounts/Accounts';
import Cards from './screens/cards/Cards';
import Settings from './screens/settings/Settings';
import Standard from './screens/standard/Standard';
import Profile from './screens/profile/Profile';

// Pay screens
import SendMoney from './screens/pay/SendMoney';
import PayAmount from './screens/pay/PayAmount';
import PayReview from './screens/pay/PayReview';
import PayPin from './screens/pay/PayPin';
import PayReceipt from './screens/pay/PayReceipt';
import PayRequest from './screens/pay/PayRequest';
import PayStopped from './screens/pay/PayStopped';
import Payees from './screens/payees/Payees';
import NewPayee from './screens/payees/NewPayee';
import Goals from './screens/young/Goals';
import GuardianConsent from './screens/young/GuardianConsent';
import GuardianView from './screens/young/GuardianView';

// Records & Support screens
import History from './screens/history/History';
import TransactionDetail from './screens/history/TransactionDetail';
import Statements from './screens/statements/Statements';
import StatementPrint from './screens/statements/StatementPrint';
import Services from './screens/services/Services';
import ServiceRequest from './screens/services/ServiceRequest';
import Learn from './screens/learn/Learn';
import LessonDetail from './screens/learn/LessonDetail';
import HelpHome from './screens/help/HelpHome';
import HelpChat from './screens/help/HelpChat';
import ReportFraud from './screens/help/ReportFraud';

const router = createBrowserRouter([
  {
    path: '/splash',
    element: <SplashScreen />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'accounts', element: <Accounts /> },
      { path: 'cards', element: <Cards /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'help/standard', element: <Standard /> },

      // Pay
      { path: 'pay', element: <SendMoney /> },
      { path: 'pay/amount', element: <PayAmount /> },
      { path: 'pay/review', element: <PayReview /> },
      { path: 'pay/pin', element: <PayPin /> },
      { path: 'pay/receipt/:id', element: <PayReceipt /> },
      { path: 'pay/request/:id', element: <PayRequest /> },
      { path: 'pay/stopped', element: <PayStopped /> },

      // Payees
      { path: 'payees', element: <Payees /> },
      { path: 'payees/new', element: <NewPayee /> },

      // Young saver
      { path: 'goals', element: <Goals /> },
      { path: 'setup/consent', element: <GuardianConsent /> },
      { path: 'guardian', element: <GuardianView /> },

      // History
      { path: 'history', element: <History /> },
      { path: 'history/:txId', element: <TransactionDetail /> },

      // Statements
      { path: 'statements', element: <Statements /> },
      { path: 'statements/print', element: <StatementPrint /> },

      // Services
      { path: 'services', element: <Services /> },
      { path: 'services/:type', element: <ServiceRequest /> },

      // Learn
      { path: 'learn', element: <Learn /> },
      { path: 'learn/:lessonId', element: <LessonDetail /> },

      // Help
      { path: 'help', element: <HelpHome /> },
      { path: 'help/chat', element: <HelpChat /> },
      { path: 'help/fraud', element: <ReportFraud /> },
      { path: 'help/report-fraud', element: <ReportFraud /> },
    ],
  },
]);

export default router;
