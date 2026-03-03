// useAuthCheck.js
import { useEffect, useState } from 'react';
import api from '../../api';

const ADMINOTPAuth = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.get('/api/adminotp', { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  return { user, checking };
};

export default ADMINOTPAuth
