import "./App.css";
import { HashRouter } from "react-router-dom";
import IndexRouter from "./router/index";
import 'antd/dist/reset.css';

function App() {
  return (
    <HashRouter>
      <IndexRouter />
    </HashRouter>
  );
}

export default App;
