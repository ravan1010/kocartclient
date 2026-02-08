import { useEffect, useState } from 'react'
import api from '../api';
import {  useNavigate } from 'react-router-dom';
import OwnerAuth from './authandroute/auth';
import Navbar from './componetstoowner/navbertoowner';


const Ownerdashboard = () => {

    const {owner} = OwnerAuth()
    const navigate = useNavigate();   

    const [post, setpost] = useState([])

    const [error, setError] = useState('');
    const [success, setsuccess] = useState('');
 

  return (
    <div>
        {owner ? <>
        <Navbar />
    <div className="h-auto w-full flex flex-col items-center mt-10">
            <div className="flex flex-col md:w-150 items-center w-full h-auto rounded px-5 p-4 shadow-xl/65 shadow-black inset-shadow-sm inset-shadow-indigo-500 "> 
                <h2 className="font-bold text-3xl mt-10"  >imaga and link for ads</h2>
               
                    
            </div> 
    </div>
    
        {Array.isArray(post) && post.map((product) => (
            <div key={product._id}  className="border rounded-2xl shadow hover:shadow-lg transition duration-300 m-1 my-2">
               <img src={product.image[0]} className="w-full h-64" />
               <a href={product.link} className='mb-5 ml-5 text-blue-900'>link </a>
               <div className='my-auto'>
                <button onClick={() => deleteimage(product._id)} className='px-8 h-10 border rounded-3xl'>Delete</button>
              </div>
            </div>
        ))}
    
    </>
    :
     <p>404</p>
        }
    </div>
  )
}

export default Ownerdashboard
