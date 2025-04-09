import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./utils/app-route";

function App() {


  return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
  );
}

export default App;