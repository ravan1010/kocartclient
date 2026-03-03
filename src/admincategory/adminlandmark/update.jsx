import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

const UpdatePost = () => {
  const { id } = useParams(); // post id
  const navigate = useNavigate();

  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [image, setimage] = useState([]); // existing images
  const [variantname, setVariantname] = useState("");
  const [variants, setVariants] = useState([{ name: "", price: "" }]);

  const [error, setError] = useState("");
  const [success, setsuccess] = useState("");

  // 🔹 Fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/admin/post/${id}`, {
          withCredentials: true,
        });

        setname(res.data.name);
        setdescription(res.data.description);
        setimage(res.data.image);
        setVariantname(res.data.variantname);
        setVariants(res.data.variants);
      } catch (err) {
        setError("Failed to load post", err);
      }
    };

    fetchPost();
  }, [id]);

  // 🔹 Variant handlers (same as create)
  const addVariant = () => {
    setVariants([...variants, { name: "", price: "" }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // 🔹 Update submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/api/admin/post/${id}`,
        {
          name,
          description,
          variants,
          variantname,
        },
        { withCredentials: true }
      );

      setsuccess("Post updated successfully");

      setTimeout(() => {
        navigate("/adminlandmark/dashboard");
      }, 300);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center mt-10">
      <div className="flex flex-col md:w-150 items-center w-full h-auto rounded px-5 p-4 shadow-xl shadow-black">
        <h2 className="font-bold text-3xl mt-10">Update Event</h2>

        <form className="w-full p-2" onSubmit={handleSubmit}>
          {/* NAME */}
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="w-full px-3 py-3 border-2 h-10"
          />

          {/* DESCRIPTION */}
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            className="w-full px-3 py-3 border-2 h-30"
          />

          {/* IMAGE (READ ONLY) */}
          <label>Images</label>
          <div className="flex gap-2 my-2">
            {image?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>

          {/* VARIANT NAME */}
          <label>Variant Name</label>
          <input
            value={variantname}
            onChange={(e) => setVariantname(e.target.value)}
            className="w-full px-3 py-3 border-2 h-10"
          />

          {/* VARIANTS */}
          <div className="border-2 p-5 mt-2">
            {variants.map((v, i) => (
              <div key={i}>
                <input
                  value={v.name}
                  placeholder="name"
                  onChange={(e) =>
                    updateVariant(i, "name", e.target.value)
                  }
                  className="border-2 w-full p-2 mb-2"
                />
                <input
                  value={v.price}
                  placeholder="price"
                  onChange={(e) =>
                    updateVariant(i, "price", e.target.value)
                  }
                  className="border-2 w-full p-2 mb-2"
                />

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-red-600 text-sm"
                  >
                    ❌ Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="mt-2 text-blue-600"
            >
              ➕ Add Variant
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <button
            type="submit"
            className="w-full my-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl"
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
