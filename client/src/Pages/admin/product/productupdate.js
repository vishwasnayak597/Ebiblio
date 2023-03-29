//similar to create
import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { useSelector } from "react-redux";
import { getProduct ,updateProduct} from "../../../functions/product";
import FileUpload from "../../../components/form/fileUploader";
import { LoadingOutlined } from "@ant-design/icons";
import ProductUpdateForm from "../../../components/form/productUpdateForm";
import { getCategories} from "../../../functions/category";
import { getAuthors } from "../../../functions/author";
import { toast } from "react-toastify";

const initialState = {
  title: "",
  description: "",
  review:"",
  price: "",
  category: "",
  author: "",
  shipping: "",
  quantity: "",
  images: [],
  lingos: ["English", "Kannada", "Hindi", "Tamil", "Telugu","Malayalam"],
  lingo:""
};

const ProductUpdate = ({ match,history }) => {
  // state
  const [values, setValues] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading,setLoading]=useState(false);
  
  const { user } = useSelector((state) => ({ ...state }));
  // router
  const { slug } = match.params;

  useEffect(() => {
    loadProduct();
    loadCategories(); //load categories along with product
    loadAuthors();
  },[]);

  const loadProduct = () => {
    getProduct(slug).then((p) => {
      setValues({ ...values, ...p.data });  //single product based on slug ,load the data prepopulates(..p.data)
    });
  };

  const loadCategories = () =>
    getCategories().then((c) => {
      console.log("GET CATEGORIES IN UPDATE PRODUCT", c.data);
      setCategories(c.data);
    });
    const loadAuthors = () =>
    getAuthors().then((c) => {
      console.log("GET Authors IN UPDATE PRODUCT", c.data);
      setAuthors(c.data);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateProduct(slug, values, user.token)
    .then((res) => {
      setLoading(false);
      toast.success(`"${res.data.title}" is updated`);
      history.push("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
      toast.error(err.response.data.err);
    });
};

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
   
  };
  
  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log("CLICKED CATEGORY", e.target.value);
    setValues({ ...values, category: e.target.value });
};

const handleAuthorChange = (e) => {
  e.preventDefault();
  console.log("CLICKED Author", e.target.value);
  setValues({ ...values, author: e.target.value });
};

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h1" />
          ) : (
            <h4>Product update</h4>
          )}
           
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            setValues={setValues}
            handleCategoryChange={handleCategoryChange}
            handleAuthorChange={handleAuthorChange}
            categories={categories}
            authors={authors}
          />
          <hr />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
