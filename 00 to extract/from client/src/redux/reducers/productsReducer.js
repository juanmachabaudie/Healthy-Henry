const initialState = {
  products: [],
  categories: [],
  loading: false,
  message: {},
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
      };

    case "GET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
        loading: false,
      };

    case "POST_PRODUCT":
      return {
        ...state,
        message: action.payload,
      };

    default:
      return state;
  }
}