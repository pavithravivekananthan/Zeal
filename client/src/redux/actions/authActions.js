import {
  SIGNUP_SUCCESS,
  LOADING_UI,
  SET_ERRORS,
  SERVER_ERROR,
  CLEAR_ERRORS,
  LOADING_USER,
  SET_USER,
  SET_ERROR,
  SET_UNAUTHENTICATED,
  SET_ERRORS_SIGNUP_SELLER,
} from '../types';

import axios from '../../utils/api';
import axiosNewInstance from 'axios';

export const signupUser = (newUserData, history) => async (dispatch) => {
  try {

    dispatch({ type: LOADING_UI });

    const res = await axios.post('/auth/signup-user', newUserData);
    if (res) {
      dispatch({
        type: SIGNUP_SUCCESS,
      });
      dispatch({ type: CLEAR_ERRORS });
      history.push('/login');
    }
  } catch (err) {
    console.log(err.response);
    if (err.response) {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    } else {
      dispatch({
        type: SERVER_ERROR,
      });
    }
  }

};

export const loginAction = (userData, history) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });
    const res = await axios.post('/auth/login', userData);

    if (res) {
      const jwt = `Bearer ${res.data.token}`;
      localStorage.setItem('jwt', jwt);
      axios.defaults.headers.common['Authorization'] = jwt;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      console.log('Authenticated, check localStorage', jwt);
      history.push('/');
    }
  } catch (err) {
    if (err.response) {
      dispatch({
        type: SET_ERROR,
        payload: err.response.data,
      });
    } else {
      dispatch({
        type: SERVER_ERROR,
      });
    }
  }
};

export const getUserData = () => async (dispatch) => {
  try {
    dispatch({ type: LOADING_USER });

    const res = await axios.get('/user');

    if (res) {
      dispatch({
        type: SET_USER,
        payload: res.data.result,
      });
    }
  } catch (err) {
    console.log(err)
    if (err.response) {
      dispatch({
        type: SET_ERROR,
        payload: err.response.data,
      });
    } else {
      dispatch({
        type: SERVER_ERROR,
      });
    }
  }
};

export const signupSeller = (newSellerData, history) => (dispatch) => {
  try {
    const location = `${newSellerData.get('aptName')},${newSellerData.get(
      'locality'
    )},${newSellerData.get('street')},${newSellerData.get('zip')}`;

    const result = axiosNewInstance.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: location,
        key: process.env.REACT_APP_GOOGLE_API_KEY,
      },
    })
    if (result) {
      if (
        Array.isArray(result.data.results) &&
        result.data.results.length > 0
      ) {
        const formattedAddress = result.data.results[0].formatted_address;
        const lat = result.data.results[0].geometry.location.lat;
        const lng = result.data.results[0].geometry.location.lng;
        newSellerData.append('lat', lat);
        newSellerData.append('lng', lng);
        newSellerData.append('formattedAddress', formattedAddress);
      }
      dispatch(signupSellerFinal(newSellerData, history));
    }
  } catch (error) {
    console.log(error)
    if (error.response) {
      dispatch({
        type: SET_ERRORS_SIGNUP_SELLER,
        payload: error.response.data,
      });
    } else {
      dispatch({
        type: SERVER_ERROR,
      });
    }
  }
};

export const signupSellerFinal = (newSellerData, history) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });
    const res = await axios.post('/auth/signup-seller', newSellerData);
    if (res) {
      dispatch({
        type: SIGNUP_SUCCESS,
      });
      dispatch({ type: CLEAR_ERRORS });
      history.push('/login');
    }
  } catch (error) {
    console.log(error)
    if (error.response) {
      dispatch({
        type: SET_ERROR,
        payload: error.response.data,
      });
    } else {
      dispatch({
        type: SERVER_ERROR,
      });
    }
  }
};

export const logoutAction = (history) => (dispatch) => {
  localStorage.removeItem('jwt');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
  if (history) history.push('/login');
};
