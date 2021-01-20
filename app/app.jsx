const React = require('react');
const ReactDOM = require('react-dom');
// const Route = require('react-router-dom').Route;
// const BrowserRouter = require('react-router-dom').BrowserRouter;
// const hashHistory = require('react-router-dom').hashHistory;

console.log("why is this suck");

/* Import Components */
const Builder = require('./components/Builder');

ReactDOM.render((<Builder />), document.getElementById('main'));

// ReactDOM.render((
//   <BrowserRouter>
//     <div>
//       <Route exact path="/" component={Builder}/>
//     </div>
//   </BrowserRouter>), document.getElementById('main'));