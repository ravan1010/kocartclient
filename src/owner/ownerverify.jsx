import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api';



const Ownerverify = () => {

    const [otp, setotp] = useState('');
    const [error, setError] = useState('');    
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        await api.post("/api/owner/verify",{ otp : otp },
         { withCredentials: true })
         .then((res) => {
          setSuccess(res.data.message)
          if(res.data.message === "verified"){
            setTimeout(() => {
              navigate('/owner');
            }, 200);
          }
        })
       
    } catch (err) {
        if (err.response) {
          setError(err.response.data.message); // Server error
          if(error === "cookie not in broswer"){
            navigate('/')
          }else if(error === "soming wrong"){
            navigate('/')
          }
        } else {
          setError("Network error"); // Network error
        }
    }
   
  };

  return (
    <div>
    <div className="h-screen flex flex-col justify-center items-center ">
            <div className="flex flex-col items-center w-70 h-auto rounded px-5 p-4 shadow-xl/65 shadow-black inset-shadow-sm inset-shadow-indigo-500 "> 
                <h2 className="font-bold text-3xl mt-10"  >OTP</h2>
                    <form action="post" className="items-center p-2 pb-0.5" onSubmit={handleSubmit} >
                        <input 
                        type='text'
                        name='otp'
                        placeholder='Enter'
                        autoComplete='on'
                        minLength={6}
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setotp(e.target.value)}  
                        required 
                        className="w-full px-3 py-3 border-b-2 outline-none mt-4 h-10"

                        />
                        {
                          success ? <p style={{ color: 'greenyellow'  }} >{success}</p>
                        :
                        <p style={{ color: 'red' }}>{error}</p>
                        }

                        <button type='submit' className="w-full my-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"> Next </button>
                    </form>

                    
            </div> 
    </div>
    </div>
  )
}

export default Ownerverify
