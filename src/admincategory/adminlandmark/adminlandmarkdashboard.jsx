import { useState } from 'react';
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../componets/Footer';
// 
import { MessageSquare, User, BadgePlus, DoorClosedLocked, DoorOpen, ShieldClose, ShieldCheck, BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react';
import api from '../../api';
import { generateAndSaveFCMToken } from '../../utili/token.js';


const Adminlandmarkdashboard = () => {

  const navigate = useNavigate()
  const [post, setpost] = useState('');
  // const [productlist, setproductlist] = useState('');
  const [adminId, setadminId] = useState('')
  const [open, setopen] = useState()
  const [marchent, setmarchent] = useState([])
  const [loading, setloading] = useState(true)


  // const [authorid, setauthorid] = useState('');



  const fetchImages = async () => {

    const res = await api.get(`/api/admin/dashboard`, { withCredentials: true });
    setpost(res.data.post);
    setopen(res.data.openORclose)
    setmarchent(res.data.marchent)

    setloading(false)

    // console.log(res.data.id, res.data.marchent)
    // setauthorid(res.data.id)
  };

  useEffect(() => {
    fetchImages()
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
  }


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

  if(loading){
    return(
       <div className="fixed inset-0 flex items-center justify-center z-50">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Loader */}
      <div className="z-10 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white mt-3">Loading...</p>
      </div>
    </div>
    )
  }

   if(!marchent.active){
    return(
      <div className="fixed inset-0 flex items-center justify-center z-50">
      
                    {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black opacity-60"
            ></div>
            {/* Popup Content */}
            <div className="bg-white rounded-2xl shadow-lg text-center z-10 w-96 p-6">
              <h1 className="text-red-500 mb-5">
                ACTIVATE YOUR ACCOUNT
              </h1>
              <p>
                contact (7349343243) or (8088303214) <br /> to active 
              </p>
            
            </div>
          </div>
    )
  }

  return (
    <>
      <Link to="/" className='h-10 w-[20%] grid mx-auto underline '>Home</Link>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className='flex justify-between' >
            <h1 className="text-3xl font-bold text-gray-800 mb-6 ">
              Dashboard
            </h1>
          </div>


          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              {/* Merchant Amount */}
              <div className="bg-white p-4 rounded-xl shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <BanknoteArrowDown />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Merchant Amount</p>
                    <h2 className="text-xl md:text-2xl font-bold">
                      ₹{marchent.amount || 0}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Commission */}
              <div className="bg-white p-4 rounded-xl shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <BanknoteArrowUp />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Commission</p>
                    <h2 className="text-xl md:text-2xl font-bold">
                      ₹{marchent.platformcommision || 0}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Create Product */}
              <div className="bg-white p-4 rounded-xl shadow flex items-center justify-center">
                <Link
                  to="/adminlandmark/productcreate"
                  className="w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                >
                  Create Product
                </Link>
              </div>

              {/* Orders */}
              <div className="bg-white p-4 rounded-xl shadow flex items-center justify-center">
                <Link
                  to="/admin/orders"
                  className="w-full text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                >
                  Orders
                </Link>
              </div>

              {/* Shop Status */}
              <div className="bg-white p-4 rounded-xl shadow">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {open ? (
                      <>
                        <DoorOpen className="text-green-600" />
                        <span className="ml-2">Open</span>
                      </>
                    ) : (
                      <>
                        <DoorClosedLocked className="text-red-600" />
                        <span className="ml-2">Closed</span>
                      </>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    checked={open}
                    onChange={handleToggle}
                    className="w-6 h-6"
                  />
                </div>
              </div>

              {/* Account */}
              <div className="bg-white p-4 rounded-xl shadow">
                <div className="flex items-center">
                  <User className="text-indigo-600" />
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Account Status</p>
                    <p className="font-bold text-green-600">Verified</p>
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

          {/* </div> */}
        </div>
      </div>
    </>
  )
}


export default Adminlandmarkdashboard  