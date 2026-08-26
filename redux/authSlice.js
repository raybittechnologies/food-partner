import {createSlice} from '@reduxjs/toolkit';
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    phoneDetails: null,
    user: null,
    token: null,
    deviceToken: null,
    isAuthenticated: false, // Track authentication status
    order: null,
    delivery:'',
    submitOrder: false,
    isOnline: true,
  
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setPhoneDetails(state, action) {
      state.phoneDetails = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setDeviceToken(state, action) {
      state.deviceToken = action.payload;
    },
    setisAuthenticated(state, action) {
      state.isAuthenticated = action.payload; // Set authentication status
    },
    setUserProfilePic(state, action) {
      if (state.user) {
        state.user = {
          ...state.user,
          UserProfile: {
            ...state.user.UserProfile,
            profilePicture: action.payload,
          },
        };
      }
    },
     setOrder(state, action) {
      state.order = action.payload;
    },
      clearOrder(state) {
      state.order = null;
    },
setDelivery(state, action) {
      state.delivery = action.payload;
},
setSubmitOrder(state, action) {
      state.submitOrder = action.payload;
},
setIsOnline(state, action) {
      state.isOnline = action.payload;
}
  
  },
});
export const {
  setUser,
  setPhoneDetails,
  setToken,
  setDeviceToken,
  setUserProfilePic,
  setisAuthenticated,
  setOrder,
  clearOrder,
  setDelivery,
  setSubmitOrder,
  setIsOnline
} = authSlice.actions;
export default authSlice.reducer;
