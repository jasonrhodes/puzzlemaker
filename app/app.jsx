const React = require('react');
const ReactDOM = require('react-dom');
const Route = require('react-router-dom').Route;
const BrowserRouter = require('react-router-dom').BrowserRouter;

/* Import Components */
const Builder = require('./components/Builder');
const Home = require('./components/Home');
const Solver = require('./components/Solver');
const Print = require('./components/Print');
const AltPrint = require('./components/AltPrint');

ReactDOM.render((
  <BrowserRouter>
    <Route exact path="/" component={Home}/>
    <Route exact path="/edit" component={Builder} />
    <Route exact path="/edit/:puzzleId" component={Builder} />
    <Route exact path="/play" component={Solver} />
    <Route exact path="/play/:puzzleId" component={Solver} />
    <Route exact path="/print" component={Print} />
    <Route exact path="/print/:puzzleId" component={Print} />
    <Route exact path="/altprint/:puzzleId" component={AltPrint} />
  </BrowserRouter>), document.getElementById('main'));