import api from '../api';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrganizerCard from './OrganizerCard';
import Navbar from './navbar';
import Footer from './Footer';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function CategoryPage() {
  const navigate = useNavigate()
  const query = useQuery();
  const [post, setpost] = useState('');
  const category = query.get("category"); // e.g., "Mobile"
  const [loading, setLoading] = useState(false);


  
    const fetchImages = async () => {
    setLoading(true)
    const res = await api.get(`/api/getpost-by-category?category=${category}`, {withCredentials: true} );
    setpost(res.data.post);
    setLoading(false)

    // setauthorid(res.data.author)
  
  };

  useEffect(() => {
    fetchImages();
  }, []);

    const tosearch = (result) => {
    const reversed = result.split("").reverse().join(""); // => "tcaer"
        navigate(`/event?d=${encodeURIComponent(reversed)}`);
      }
  
    const onlandmark = (category) => {
      if(category === "adminlandmark"){
        return "onOwner" 
      }else if(category === "clientslandmark"){
        return "onYour"
      }
    }

  return (
    <div>
      <Navbar />
      
      {loading && <p className='text-3xl fixed font-bold '>Loading...</p>}
      {!loading && post.length === 0 && category && <p>No results found.</p>}
               

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(post) && post.map(organizer => (
                <OrganizerCard key={organizer._id} organizer={organizer} />                
              ))}
           </div>
               <Footer />
    </div>
  );
}

export default CategoryPage