import api from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Token = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    api.defaults.headers['Authorization'] = 'Bearer ' + token;
  } catch (error) {
    console.log(error);
  }
};

export const loginApi = async payload => {
  try {
    let response = await api.post('auth/login', payload);
    return response.data;
  } catch (err) {
    console.log(err.response);
    if (err) {
      console.log('Login Api Exception: ', err);
    }
  }
};

export const registerApi = async payload => {
  try {
    let response = await api.post('auth/register', payload);
    return response.data;
  } catch (err) {
    console.log(err.response);
    if (err) {
      console.log('Register Api Exception: ', err);
    }
  }
};

export const contact_person_list_api = async payload => {
  try {
    await Token();
    let response = await api.get('common/contact_people_list', {
      params: payload,
    });
    return response.data;
  } catch (err) {
    console.log(err.response);
    if (err) {
      console.log('Contact Person List Api Exception: ', err);
    }
  }
};

{/* home */}

export const home_api = async payload => {
  try {
    await Token();
    let response = await api.get('dashboard/index', {params: payload});
    return response.data;
  } catch (err) {
    console.log(err.response);
    if (err) {
      console.log('Home Api Exception: ', err);
    }
  }
};

{/* transaction */}

export const transaction_history_api = async payload => {
  try {
    await Token();
    let response = await api.get('transaction/index', {params: payload});
    return response.data;
  } catch (err) {
    console.log(err.response);
    if (err) {
      console.log('Transaction History Api Exception: ', err);
    }
  }
};

export const transaction_add_update_api = async payload => {
  try {
    await Token();
    let response = await api.post('transaction/addUpdate', payload);
    return response.data;
  } catch (err) {
    console.log(err.response);
    if (err) {
      console.log('Add Update Api Exception: ', err);
    }
  }
};

{/* contact people */}

export const contact_people_list_api = async payload => {
  try {
    await Token();
    let response = await api.get('contact_people/index', {params: payload});
    return response.data;
  } catch (err) {
    console.log(err.response);
    if (err) {
      console.log('Contact People List Api Exception: ', err);
    }
  }
};

{/* tags */}

export const transaction_tags_list_api = async payload => {
  try {
    await Token();
    let response = await api.get('transaction/tagLists', {params: payload});
    return response.data;
  } catch (err) {
    console.log(err.response);
    if (err) {
      console.log('Transaction Tags List Api Exception: ', err);
    }
  }
};

export const transaction_tags_details_api = async payload => {
  try {
    await Token();
    let response = await api.get('transaction/tagDetail', {params: payload});
    return response.data;
  } catch (err) {
    console.log(err.response);
    if (err) {
      console.log('Transaction Tags Details Api Exception: ', err);
    }
  }
};