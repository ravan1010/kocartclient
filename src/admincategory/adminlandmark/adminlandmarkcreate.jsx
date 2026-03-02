import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../../api';



const CreatePost = () => {

  const [name, setname] = useState('');
  // const [description, setdescription] = useState('');
  const [image, setimage] = useState('');
  const [variantname, setVariantname] = useState('');
  const [error, setError] = useState('');
  const [success, setsuccess] = useState('');
  const navigate = useNavigate();

  const [variants, setVariants] = useState([
    { name: "", price: "" },
  ]);

  const addVariant = () => {
    setVariants([...variants, { name: "", price: "" }]);
  };

  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  //image to convert to base64

  const MAX_SIZE_MB = 1;
  const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024; // 1MB in bytes

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 1) {
      alert("You can only upload 1 file.");
      e.target.value = '';
      return;
    }

    const file = files[0];

    // ✅ Type validation
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, or WEBP allowed.");
      e.target.value = '';
      return;
    }

    // ✅ 1MB validation
    if (file.size > MAX_SIZE) {
      alert("Image must be less than 1MB.");
      e.target.value = '';
      return;
    }

    try {
      const base64 = await toBase64(file);
      setimage([base64]);
    } catch (error) {
      console.error(error);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };


  //submit handler

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      return alert('upload image')
    }


    try {

      await api.post("/api/admin/post", {
        name: name,
        // description: description,
        image: image,
        variants: variants,
        variantname: variantname

      },
        { withCredentials: true })
        .then((res) => {
          setsuccess(res.data.message)
          if (res.data.message === "post created") {
            setTimeout(() => {
              navigate('/adminlandmark/dashboard')
            }, 200);
          }

        })


    } catch (err) {
      if (err.response) {
        setError(err.response.data.message); // Server error
      } else {
        setError('network error'); // Network error
      }
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 md:p-10">

        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Create
        </h2>

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >

          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          {/* <div>
            <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Write short description..."
              maxLength={200}
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg resize-none h-28 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-sm text-gray-400 mt-1">
              {description.length}/200
            </p>
          </div> */}

          {/* Image Upload */}
          <div className="border-2 border-dashed rounded-xl p-6 text-center">
            <h3 className="font-semibold text-lg text-gray-700">
              Upload Images
            </h3>
            <h3 className="font-semibold text-sm mb-3 text-black/50">
              (Only 1 image allowed, max size 1MB, JPG/PNG/WEBP)
            </h3>

            <label
              htmlFor="image"
              className="inline-block cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition"
            >
              📸 Choose Images
            </label>

            <input
              type="file"
              multiple
              id="image"
              name="image"
              onChange={handleFiles}
              className="hidden"
            />
          </div>
          {image && (
            <img src={image} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
          )}

          {/* Variant Name */}
          <div>
            <label htmlFor="variant" className="block font-medium text-gray-700 mb-1">
              Variant Group Name
            </label>
            <input
              id="variant"
              type="text"
              placeholder="Eg: Variant Type"
              value={variantname}
              onChange={(e) => setVariantname(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Variants */}
          <div className="space-y-4 border rounded-xl p-5 bg-gray-50">
            <h4 className="font-semibold text-lg text-gray-700">
              Variants
            </h4>

            {variants.map((v, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-sm space-y-2 relative"
              >
                <input
                  placeholder="Variant name"
                  onChange={(e) => updateVariant(i, "name", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />

                <input
                  placeholder="Price"
                  type="number"
                  onChange={(e) => updateVariant(i, "price", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="w-full border-2 border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg transition"
            >
              ➕ Add Variant
            </button>
          </div>

          {/* Messages */}
          {error && (
            <p className="text-red-500 font-medium text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-600 font-medium text-center">{success}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition"
          >
            🚀 Create Event
          </button>
        </form>
      </div>
    </div>

  )
}

export default CreatePost
