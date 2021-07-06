import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./headerComponent/header";
import Home from "./homeComponent/home";
function App() {
  return (
    <div className="App">
      <Header/>
        <Home/>
    </div>
  );
}

export default App;
