// ProtectedRoute.js
import useAuthCheck from '../atokenauth';
import { Link, useNavigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  const { user, checking } = useAuthCheck();
  const navigate = useNavigate();


  if(checking) return <div>Loading...</div>;
  if(!user) return navigate('/signup');

  return children;
};

export default ProtectedRoute
