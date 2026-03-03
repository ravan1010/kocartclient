import { useState } from 'react';
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../componets/Footer';
// 
import { MessageSquare, User, BadgePlus,  DoorClosedLocked, DoorOpen, ShieldClose, ShieldCheck } from 'lucide-react';
import api from '../../api';
import { generateAndSaveFCMToken } from '../../utili/token.js';


const Adminlandmarkdashboard = () => {


  const navigate = useNavigate()
  const [post, setpost] = useState('');
  const [productlist, setproductlist] = useState('');
  const [adminId, setadminId] = useState('')
  const [open, setopen] = useState()



  const [authorid, setauthorid] = useState('');



   const fetchImages = async () => {
    const res = await api.get(`/api/admin/dashboard`, { withCredentials: true });
    setpost(res.data.post);
    setproductlist(res.data.productlist)
    setopen(res.data.openORclose)
    console.log(res.data.id)
    setauthorid(res.data.id)
  };

  useEffect(() => {
    fetchImages();
    generateAndSaveFCMToken()
  }, [])

  const handleToggle = async () => {

    const newStatus = !open;
    setopen(newStatus);

    try {
      await api.post(
        "/api/admin/door",
        { open: newStatus },
        { withCredentials: true }
      ).then((res) => {
        if (res.data.success === true) {
          fetchImages()
        }
      })
    } catch (err) {
      console.error(err);
    }
  };

  const handleitem = async (id, opentopost) => {
    const newStatus = !opentopost;

    // Optimistic UI updat

    try {
      await api.post(
        `/api/admin/post/open/${id}`,
        { open: newStatus },
        { withCredentials: true }
      ).then((res) => {
        if (res.data.success) {
          fetchImages()
        }
      })
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message;

      if (msg === "store door off") {
        alert("⏰ Store is currently closed. Please try again later.");
      } else {
        alert("Something went wrong. Please try again.");
      }



      // rollback if failed
    }
  };


  const deleteProduct = async (id) => {
    try {
      await api.delete(`/api/admin/${id}`, { withCredentials: true })
        .then((res) => {
          alert(res.data.message)
          window.location.reload();
        })
        .catch(() => alert('delete failed'))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const admin = async () => {
      try {
        await api.get('/api/adminid', { withCredentials: true })
          .then((res) => setadminId(res.data.id))
          .catch((err) => console.log(err))
      } catch (error) {
        console.log(error)
      }
    }
    admin()
  }, [adminId])


  return (
    <>
  
      <Link to="/" className='h-10 w-[20%] grid mx-auto underline '>Home</Link>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-black">
                  <BadgePlus size={24} />
                </div>
                <div className="ml-4">
                  <Link to='/adminlandmark/productcreate' className='border-2 mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl'>Create Event</Link>
                </div>
              </div>
            </div> 

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-4 flex rounded-full bg-green-100 text-green-600 ">
                  {open === false ? <>
                    <DoorClosedLocked size={24} />
                    <p className='mx-2'>close</p>
                  </>
                    :
                    <>
                      <DoorOpen size={24} />
                      <p className='mx-2'>open</p>
                    </>
                  }
                </div>
                <div className="ml-8">
                  <input
                    type="checkbox"
                    checked={open}
                    onChange={handleToggle}
                    className='w-6 h-6 border'
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <MessageSquare size={24} />
                </div>
       
                <div className="ml-4">
                  <Link to={'/admin/order'} className='border-2 mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl'>Orders</Link>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <User size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="text-xl font-bold text-green-600">Verified</p>
                </div>
              </div>
            </div>

          </div>

          {/*event posts*/}


          <div className="w-full mt-10 p-5 hidden md:flex flex-col">
            {Array.isArray(post) &&
              post.map((item) => (
                <div
                  key={item._id}
                  className="border p-3 m-2 flex w-full rounded-lg items-center"
                >
                  {/* Image */}
                  <div className="h-16 w-16 mr-4">
                    <img
                      src={item.image?.[0]}
                      alt={item.name}
                      className="h-full w-full object-cover rounded"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.variantname}</p>
                    </div>

                    <div>
                      {item.variants.map((v) => (
                        <p key={v._id} className="text-sm">
                          {v.name} — ₹{v.price}
                        </p>
                      ))}
                    </div>

                    <p className="font-bold">{item.Eventcategory}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 ml-4">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={() => handleitem(item._id, item.active)}
                      className="w-5 h-5"
                    />

                    {item.active ? (
                      <ShieldCheck className="text-green-600" />
                    ) : (
                      <ShieldClose className="text-red-600" />
                    )}

                    <button
                      onClick={() =>
                        navigate(`/adminlandmark/update/${item._id}`)
                      }
                      className="px-4 py-1 rounded-full border border-blue-500 text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(item._id)}
                      className="px-4 py-1 rounded-full border border-red-500 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>


          <div className="w-full mt-2 flex flex-col p-4 lg:hidden md:hidden ">
            {Array.isArray(post) &&
              post.map((item) => (
                <div
                  key={item._id}
                  className="w-full border rounded-xl p-3 mb-3 shadow-sm bg-white"
                >
                  {/* Top Section */}
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-[30%]">
                      <img
                        src={item.image?.[0]}
                        alt={item.name}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Info */}
                    <div className="w-[70%]">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.variantname}</p>

                      <ul className="mt-1 space-y-1">
                        {item.variants.map((variant) => (
                          <li
                            key={variant._id}
                            className="flex justify-between text-xs"
                          >
                            <span>{variant.name}</span>
                            <span className="font-medium">₹{variant.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 mt-3">
                    <div className="flex items-center gap-2 border-r-2 border-l-2 px-4">
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={() => handleitem(item._id, item.active)}
                        className="cursor-pointer w-6 h-6"
                      />

                      {item.active ? (
                        <ShieldCheck size={28} className="text-green-600" />
                      ) : (
                        <ShieldClose size={28} className="text-red-600" />
                      )}
                    </div>

                    <button
                      onClick={() => navigate(`/adminlandmark/update/${item._id}`)}
                      className="px-4 py-1 text-sm rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(item._id)}
                      className="px-4 py-1 text-sm rounded-full border border-red-500 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <Footer />
          {/* Recent Bookings Table */}

        </div>
      </div>
    </>
  )
}

export default Adminlandmarkdashboard
