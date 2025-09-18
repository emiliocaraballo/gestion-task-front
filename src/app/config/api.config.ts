import { environment } from '../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  endpoints: {
    todos: '/todos'
  },
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
};
