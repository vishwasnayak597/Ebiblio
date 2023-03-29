//
export const userReducer = (state = null, action) => {
    switch (action.type) {
        //return type.payload, payload will contain user info like email,
      case "LOGGED_IN_USER":
        return action.payload;
      case "LOGOUT":
        return action.payload;
      default:
        return state;
    }
  };
  