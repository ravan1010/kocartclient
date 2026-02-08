// ProtectedRoute.js
import useAuthCheck from '../atokenauth';
import { Link, useNavigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  const { user, checking } = useAuthCheck();
  const navigate = useNavigate();


  if(checking) return <div>Loading...</div>;
  if(!user) return <>
  <div>
    <div className="h-screen flex flex-col justify-center items-center ">
            <div className="flex flex-col items-center w-auto h-auto rounded px-5 p-4 shadow-xl/65 shadow-black inset-shadow-sm inset-shadow-indigo-500 "> 
                <Link className="font-bold text-3xl rounded-2xl border px-8"  to={'/signup'} >first Register</Link>
            </div> 
    </div>
    </div>
  </>

  return children;
};

export default ProtectedRoute
