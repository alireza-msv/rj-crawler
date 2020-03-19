const axios = require('axios');

const request = (config) => axios({
  ...config,
  baseURL: 'https://www.radiojavan.com/',
  maxRedirects: 0,
  validateStatus: (status) => status < 400,
});

const get = (url, params, config) => (
  request({
    url,
    params,
    method: 'GET',
    ...config,
  })
);

const post = (url, data, config) => (
  request({
    url,
    data,
    method: 'POST',
    ...config,
  })
);

module.exports = {
  get,
  post,
};
