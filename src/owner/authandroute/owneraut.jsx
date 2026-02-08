// ProtectedRoute.js
import OwnerAuth from './auth';
import { Link, useNavigate } from "react-router-dom";


const OwnerRoute = ({ children }) => {
  const { owner, checking } = OwnerAuth();


  if(checking) return <div>Loading...</div>;
  if(!owner) return <p>404</p>

  return children;
};

export default OwnerRoute
