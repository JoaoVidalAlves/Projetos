import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
      </DataProvider>
    </AuthProvider>
  );
}
