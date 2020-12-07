import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import SearchBar from '../components/searchBar';
import Spinner from '../utils/spinner/spinner';
// import RestaurantContent from '../components/restaurantContent';

const useStyles = makeStyles(() => ({
  center: {
    textAlign: 'center',
    marginTop: '200px'
  },
  SearchBar: {
    margin: '24px 0 28px 360px',
  },
}));

const Home = () => {
  const classes = useStyles();
  const { loading } = useSelector((state) => state.data);
  const {
    account: { role },
    authenticated,
  } = useSelector((state) => state.auth);
  const [locationStatus, setLocationStatus] = useState(
    localStorage.getItem('location') ? true : false
  );

  let restaurantMarkup = loading ? <Spinner /> : '';
  return (
    <>
      {authenticated && role === 'SELLER' ? (
        <Redirect to='/seller/dashboard' />
      ) : (
          <>
            <Grid container direction='column' justify='center'>
              <Grid item>
                <Typography variant='h5' className={classes.center} noWrap>
                  Get your favourite food, delivered with ZippyZeal&nbsp;&nbsp;
                </Typography>
              </Grid>
              <Grid item className={classes.SearchBar}>
                <SearchBar page='home' action={setLocationStatus} />
              </Grid>
              <Grid item container>
                <Grid item xs={false} sm={1} />
                <Grid item xs={12} sm={10}>
                  {locationStatus ? (
                    restaurantMarkup
                  ) : (
                      <Typography variant='body1' className={classes.center} noWrap>
                        Enter your location to view nearby restaurants
                  </Typography>
                    )}
                </Grid>
                <Grid item xs={false} sm={1} />
              </Grid>
            </Grid>
          </>
        )}
    </>
  );
};

export default Home;
