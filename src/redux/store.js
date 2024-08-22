import {configureStore} from '@reduxjs/toolkit';

import appReducer from './reducer/app';

export default configureStore({
  reducer: {
    app: appReducer,
  },
});