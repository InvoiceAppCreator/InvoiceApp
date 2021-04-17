import './App.css';
import {Route, BrowserRouter as Router} from 'react-router-dom'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Home from './Pages/Home'
import Quotes from './Pages/Quotes'
import Invoices from './Pages/Invoices'
import CreateQuote from './Pages/CreateQuote'
import ConvertToInvoice from './Pages/ConvertToInvoice'
import CreateInvoice from './Pages/CreateInvoice'
import Settings from './Pages/Settings'
import logout from './components/Logout/logout'

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
        <Route path='/quotes/convert-to-invoice' exact component={ConvertToInvoice}/>
        <Route path='/invoices' exact component={Invoices}/>
        <Route path='/invoices/create-invoice' exact component={CreateInvoice}/>
        <Route path='/settings' exact component={Settings}/>
        <Route path='/logout' exact component={logout}/>
      </Router>
    </div>
  );
}

export default App;
