import AllRoutes from "./routes";
import { AppProvider } from "./contexts/AppContext";

function App() {
  return (
    <>
      <AppProvider>
        <AllRoutes />
      </AppProvider>
    </>
  );
}

export default App;
