import axios from 'axios';

export default axios.create({
  baseURL: 'https://dgbook.myassistantz.com/api/',
  headers: {
    // 'x-api-key': 'uniqr@123',
    // 'Content-Type': 'application/json',
    Accept: 'application/json'
  },
});

