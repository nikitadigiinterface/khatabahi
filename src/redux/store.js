import {configureStore} from '@reduxjs/toolkit';

import appReducer from './reducer/app';
import userReducer from './reducer/user';

export default configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
  },
});