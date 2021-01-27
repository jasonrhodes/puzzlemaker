const React = require('react');
const ReactDOM = require('react-dom');
const Route = require('react-router-dom').Route;
const BrowserRouter = require('react-router-dom').BrowserRouter;
const hashHistory = require('react-router-dom').hashHistory;

/* Import Components */
const Builder = require('./components/Builder');
const Home = require('./components/Home');
const Solver = require('./components/Solver');

ReactDOM.render((
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Home}/>
      <Route exact path="/edit/:puzzleId" component={Builder} />
      <Route exact path="/edit" component={Builder} />
      <Route exact path="/play" component={Solver} />
      
    </div>
  </BrowserRouter>), document.getElementById('main'));