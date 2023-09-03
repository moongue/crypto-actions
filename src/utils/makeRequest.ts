import axios from 'axios';
export const makeRequest = ({
  method = 'get',
  url,
  headers = {},
  body = {},
}: {
  method: 'get' | 'post';
  url: string;
  headers?: Record<string, any>;
  body?: Record<string, any>;
}) => {
  if (method === 'post') {
    return axios.post(url, body, { headers });
  }

  return axios.get(url, { headers });
};
