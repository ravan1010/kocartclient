// useAuthCheck.js
import { useEffect, useState } from 'react';
import api from '../../api';

const useAuthCheck = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.get('/api/token', { withCredentials: true , headers: { "Content-Type": "application/json" }})
      .then((res) => {
        if(!res.data.massage){
          setUser(res.data.user)
        }else{
          setUser(null)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  return { user, checking };
};

export default useAuthCheck;
