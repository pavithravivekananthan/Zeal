import {
  SET_RESTAURANTS,
  LOADING_DATA,
  SET_RESTAURANT,
  ADD_CART_FAIL,
  ADD_CART_SUCCESS
} from '../types';

const initialState = {
  restaurants: [],
  restaurant: {},
  cart: [],
  price: '',
  loading: false,
  addCartSuccess: null,
  deleteSuccessItem: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_RESTAURANTS:
      return {
        ...state,
        loading: false,
        restaurants: action.payload,
      };
    case SET_RESTAURANT:
      return {
        ...state,
        loading: false,
        restaurant: action.payload.result,
      };
    case ADD_CART_SUCCESS:
      return {
        ...state,
        addCartSuccess: true,
      };
    case ADD_CART_FAIL:
      return {
        ...state,
        addCartSuccess: false,
      };
    default:
      return state;
  }
}
