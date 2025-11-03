import { AppProvider } from './contexts/AppContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AppProvider>
      <OnboardingProvider>
        <Dashboard />
      </OnboardingProvider>
    </AppProvider>
  );
}

export default App;
