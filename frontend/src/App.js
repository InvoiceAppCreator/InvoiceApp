import './App.css';
import {Route, BrowserRouter as Router, Link} from 'react-router-dom'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Home from './Pages/Home'
import Quotes from './Pages/Quotes'
import Invoices from './Pages/Invoices'
import CreateQuote from './Pages/CreateQuote'

function App() {

  return (
    <div>
      <Router>
        <Route path='/' exact component={Login}/>
        <Route path='/login' exact component={Login}/>
        <Route path='/signup' exact component={Signup}/>
        <Route path='/home' exact component={Home}/>
        <Route path='/quotes' exact component={Quotes}/>
        <Route path='/quotes/create-quote' exact component={CreateQuote}/>
        <Route path='/invoices' exact component={Invoices}/>
      </Router>
    </div>
  );
}

export default App;
