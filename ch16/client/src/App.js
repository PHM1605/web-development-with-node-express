import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import logo from './img/logo.png';
import './App.css';
import Vacations from './Vacations';

function Home() {
  return (
    <div>
      <h2>Welcome to Meadowlark Travel</h2>
      <ul>
        <li>Check out our "<Link to="/about">About</Link>" page!</li>
        <li>And our <Link to="/vacations">vacations</Link>!</li>
      </ul>
    </div>
  );
}

function About() {
  return (
    <i>
      coming soon
    </i>
  );
}

function NotFound() {
  return (
    <i>Not Found</i>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>Meadowlark Travel</h1>
          <Link to="/"><img src={logo} alt="Meadowlark Travel Logo" /></Link>
        </header>
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/about" exact element={<About/>} />
          <Route path="/vacations" exact element={<Vacations/>} />
          <Route component={NotFound} />
        </Routes>
      </div>
    </Router>    
  );
}

export default App;
