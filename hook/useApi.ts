import { useContext } from 'react';

import { ApiContext } from '../api/ApiContext';

export function useApi() {
  return useContext(ApiContext);
}