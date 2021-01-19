const React = require('react');
const ReactDOM = require('react-dom');
const {
  BrowserRouter,
  Switch,
  Route
} = require('react-router-dom')

/* Import Pages */
const Splash = require('./splashComponents/Splash');
const Profile = require('./profileComponents/Profile');
const Search = require('./searchComponents/Search');
const Result = require('./resultComponents/Result');
const NotFound = require('./NotFound');

const App = () => <BrowserRouter>

	<Switch>
    
    <Route exact path="/">
			<Splash/>
		</Route>
    
    <Route path= "/search">
			<Search/>
		</Route>
    
    <Route path = "/result">
      <Result/>
    </Route>
    
    <Route path = "/profile">
      <Profile/>
    </Route>
    
    <Route path = '/'>
      <NotFound/>
    </Route>
    
	</Switch>
</BrowserRouter>

ReactDOM.render(<App/>, document.getElementById('main'));

