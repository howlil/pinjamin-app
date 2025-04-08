import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/app-route";

function App() {


  return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
  );
}

export default App;