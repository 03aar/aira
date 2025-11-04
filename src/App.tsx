import { AppProvider } from './contexts/AppContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import DashboardRefined from './pages/DashboardRefined';

function App() {
  return (
    <AppProvider>
      <OnboardingProvider>
        <DashboardRefined />
      </OnboardingProvider>
    </AppProvider>
  );
}

export default App;
