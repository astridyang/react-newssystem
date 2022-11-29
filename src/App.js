import "./App.css";
import { HashRouter } from "react-router-dom";
import IndexRouter from "./router/index";
function App() {
  return (
    <HashRouter>
      <IndexRouter />
    </HashRouter>
  );
}

export default App;
