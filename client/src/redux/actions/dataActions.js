import {
  SET_RESTAURANTS,
  LOADING_DATA,
  SET_RESTAURANT,
  LOADING_UI,
  SET_ERROR_ITEM,
  SERVER_ERROR,
  CLEAR_ERRORS,
  ADD_ITEM,
  DELETE_ITEM,
  EDIT_ITEM,
  SET_ERRORS,
  ADD_CART_FAIL,
  ADD_CART_SUCCESS
} from '../types';
import axios from '../../utils/api';
import axiosNewInstance from 'axios';
import { getUserData } from './authActions';

export const fetchRestaurants = () => async (dispatch) => {
  try {
    dispatch({ type: LOADING_DATA });
    const res = await axios.get('/restaurants')
    if (res) {
      dispatch({
        type: SET_RESTAURANTS,
        payload: res.data,
      });
    }

  } catch (err) {
    console.log(err);
    dispatch({
      type: SET_RESTAURANTS,
      payload: [],
    });
  }
};

export const fetchRestaurantsByAddress = (lat, lng) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_DATA });
    axios
      .get(`/restaurants-location/${lat}/${lng}`)
      .then((res) => {
        dispatch({
          type: SET_RESTAURANTS,
          payload: res.data,
        });
      })
  } catch (err) {
    console.log(err);
    dispatch({
      type: SET_RESTAURANTS,
      payload: [],
    });
  }
};

export const fetchRestaurant = (restId) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_DATA });
    const res = await axios.get(`/restaurant/${restId}`)
    if (res) {
      dispatch({
        type: SET_RESTAURANT,
        payload: res.data,
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: SET_RESTAURANT,
      payload: {},
    });
  }
};

export const addItem = (itemData) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });
    const res = await axios
      .post(`/seller/create-item`, itemData)
    if (res) {
      dispatch({
        type: ADD_ITEM,
        payload: res.data.item,
      });
      dispatch({ type: CLEAR_ERRORS });
    }
  } catch (err) {
    console.log(err.response.data);
    if (err.response) {
      dispatch({
        type: SET_ERROR_ITEM,
        payload: err.response.data,
      });
    } else {
      dispatch({
        type: SERVER_ERROR,
      });
    }
  }
};

export const deleteItem = (itemId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/seller/delete-item/${itemId}`)
    if (res) {
      dispatch({
        type: DELETE_ITEM,
        payload: itemId,
      });
    }
  } catch (err) {
    console.log(err.response);
  }
};

export const editItem = (itemData, itemId) => async (dispatch) => {
  try {
    const res = await axios.put(`/seller/edit-item/${itemId}`, itemData)
    if (res) {
      dispatch({
        type: EDIT_ITEM,
        payload: res.data.item,
      });
    }
  } catch (err) {
    console.log(err.response.data);
    if (err.response) {
      dispatch({
        type: SET_ERROR_ITEM,
        payload: err.response.data,
      });
    } else {
      dispatch({
        type: SERVER_ERROR,
      });
    }
  }
};

export const addToCart = (itemData) => async (dispatch) => {
  try {
    const res = await axios.post('/cart', itemData);
    if (res) {
      dispatch({
        type: ADD_CART_SUCCESS,
        payload: itemData.itemId,
      });
    }

  } catch (err) {
    console.log(err.response);
    dispatch({
      type: ADD_CART_FAIL,
    });
  }
};

export const fetchAddress = (userData, history) => async (dispatch) => {
  try {
    const location = `+${userData.aptName},+${userData.locality},+${userData.street},+${userData.zip}`;
    const result = axiosNewInstance
      .get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: location,
          key: process.env.REACT_APP_GOOGLE_API_KEY,
        },
      })

    const formattedAddress = result.data.results[0].formatted_address;
    console.log(formattedAddress);
    const lat = result.data.results[0].geometry.location.lat;
    const lng = result.data.results[0].geometry.location.lng;
    userData.lat = lat;
    userData.lng = lng;
    userData.formattedAddress = formattedAddress;
    dispatch(addAddress(userData, history));

  } catch (err) {
    console.log(err);
  }
};

export const addAddress = (userData, history) => async (dispatch) => {
  try {
    console.log(userData.formattedAddress);
    const res = await axios.post('/user/address', userData)

    if (res) {
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
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

