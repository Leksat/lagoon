// @flow

const axios = require('axios');
const R = require('ramda');

const API_HOST = R.propOr(
  'http://gitlab',
  'GITLAB_API_HOST',
  process.env,
);
const API_TOKEN = R.propOr(
  'personal access token',
  'GITLAB_API_TOKEN',
  process.env,
);

const options = {
  baseURL: `${API_HOST}/api/v4/`,
  timeout: 2000,
  headers: {
    'Private-Token': API_TOKEN,
  },
};

const gitlabapi = axios.create(options);

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GitLabAPIError';
  }
}

const getRequest = async (url: string): Object => {
  try {
    const response = await gitlabapi.get(url);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new APIError(
        R.pathOr(error.message, ['data', 'message'], error.response),
      );
    } else if (error.request) {
      throw new NetworkError(error.message);
    } else {
      throw error;
    }
  }
};

const getGroup = async (groupId: number): Object => getRequest(`groups/${groupId}`);

module.exports = {
  getGroup,
};
