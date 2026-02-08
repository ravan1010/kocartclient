import { useState } from 'react'
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';



const Ownerlog = () => {

    const [adminsignup, setadminsignup] = useState('');
    const [error, setError] = useState('');
    const [success, setsuccess] = useState('');
    const navigate = useNavigate();


   function handleNUMChange(e) {
         const value = e.target.value;
  // Allow only numbers
         if (/^\d*$/.test(value)) {
            setadminsignup(value);
        }
    }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await api.post("/api/owner/log",{ 
          number : adminsignup, 
        },
         { withCredentials: true })
         .then((res) => {
            setsuccess(res.data.message)
            if(res.data.message === "otp sent"){
                navigate('/owner/verify')
            }
         })

      
    } catch (err) {
       if (err.response) {
          setError(err.response.data.message); // Server error
        } else {
          setError("Network error"); // Network error
        }
    }
   
  };

  return (
    <div>
    <div className="h-screen flex flex-col justify-center items-center ">
            <div className="flex flex-col items-center w-70 h-auto rounded px-5 p-4 shadow-xl/65 shadow-black inset-shadow-sm inset-shadow-indigo-500 "> 
                <h2 className="font-bold text-3xl mt-10"  >Owner</h2>
                    <form action="post" className="items-center p-2 pb-0.5" onSubmit={handleSubmit} >

                        <input 
                        type='text'
                        name='adminsignup'
                        placeholder='Number'
                        autoComplete='tel'
                        minLength={10}
                        maxLength={10}
                        value={adminsignup}
                        onChange={handleNUMChange}  
                        required 
                        className="w-full px-3 py-3 border-b-2 outline-none mt-4 h-10"

                        />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: "greenyellow" }}>{ success }</p>}


                        <button type='submit' className="w-full my-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"> send otp </button>
                    </form>

            </div> 
    </div>
    </div>
  )
}

export default Ownerlog
