import React from "react";
import { db, app, storage } from "../firebase/index";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  listAll,
} from "firebase/storage";
import {
  setDoc,
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { async } from "@firebase/util";
const CreateChildCategory = () => {
  const [catinfo, setCatinfo] = useState("");
  const [catimage, setCatimage] = useState("");
  const [parentcat, setparentcat] = useState([]);
  const [selectedcat, setselectedcat] = useState("");

  const [allimages, setAllimages] = useState([]);

  const handleChange = (e) => {
    setCatinfo(e.target.value);
  };

  // ftch all parent categories

  useEffect(() => {
    // onSnapshot(doc(db, 'categories'), (doc) => {
    //   setparentcat(doc.data());
    // });

    const unsub = onSnapshot(collection(db, "categories"), (snapshot) => {
      let employeesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setparentcat(employeesArr);
      console.log(employeesArr);
    });
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);

    const storage = getStorage();
    const testRef = ref(storage, `childcategories/${file.name}`);
    console.log("testRef", testRef);
    // send image file to storage with test ref info
    await uploadBytes(testRef, file).then((snapshot) => {
      console.log("Uploaded image to storage success!");
    });

    // get image url from storage and set into state
    const down = await getDownloadURL(testRef);
    setCatimage(down);
  };

  const handlesubmit = (e) => {
    e.preventDefault();

    let data = addDoc(collection(db, "childcategories"), {
      childcat_name: catinfo,
      childcat_image: catimage,
        parentcat_name: selectedcat,
    });
  };

  return (
    <div>
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="username"
            >
              Child-Category name {selectedcat}
            </label>
            <input
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>

          {/* ---select parent cate---- */}

          <div>
            <div>
              <select
                onChange={(e) => {
                  setselectedcat(e.target.value);
                }}
              >
                {parentcat?.map((cat) => (
                  <option value={cat?.id} key={cat?.id}>
                    {" "}
                    {cat?.catinfo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="password"
            >
              Upload Image
            </label>
            <input
              onChange={handleImageChange}
              class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="file"
              multiple={false}
            />
            <p class="text-red-500 text-xs italic">.</p>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handlesubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Create childcategory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChildCategory;
