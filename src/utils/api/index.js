import { api } from 'peanut-all';
import { apis, host } from './api';
api.config({ apis, host });

export default api;