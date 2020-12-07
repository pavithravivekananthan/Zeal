import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutAction, getUserData } from './redux/actions/authActions';
import axios from './utils/api';
import jwtDecode from 'jwt-decode';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './utils/theme';
import NavBar from './components/navBar';
import ScrollToTop from './utils/scrollToTop';
import { AuthRoute, SellerRoute } from './utils/route';
import home from './components/home';
import notFound from './components/notFound';
import register from './components/registerForm';
import login from './components/loginForm';
import addRestaurant from './components/addRestaurant';
import sellerDash from './components/sellerDashboard';
import Footer from './components/footer';


const theme = createMuiTheme(themeFile);

const token = localStorage.jwt;

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutAction());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <NavBar />
          <ScrollToTop />
          <Switch>
            <Route exact path='/' component={home} />
            <AuthRoute exact path='/login' component={login} />
            <AuthRoute exact path='/register' component={register} />
            <AuthRoute exact path='/addrestaurant' component={addRestaurant} />
            <SellerRoute
              exact
              path='/seller/dashboard'
              component={sellerDash}
            />
            <Route component={notFound} />
          </Switch>
          <Footer />
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
