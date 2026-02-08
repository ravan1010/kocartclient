// useAuthCheck.js
import { useEffect, useState } from 'react';
import api from '../../api';

const OwnerAuth = () => {
  
  const [owner, setowner] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.get('/api/owner/token', { withCredentials: true })
      .then((res) => setowner(res.data.owner))
      .catch(() => setowner(null))
      .finally(() => setChecking(false));
  }, []);

  return { owner, checking };
};

export default OwnerAuth;
