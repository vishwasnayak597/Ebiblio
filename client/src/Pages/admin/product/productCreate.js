import React,{useState,useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {createProduct} from "../../../functions/product";
import ProductCreateForm from '../../../components/form/productCreateForm';
import { getCategories } from "../../../functions/category";
import { getAuthors } from "../../../functions/author";
import FileUpload from '../../../components/form/fileUploader';
import { LoadingOutlined } from "@ant-design/icons";

let categoryData = [];
let authorsData = [];

const initialState = {
    title: "",
    description: "",
    review:"",
    price: "",
    categories: [],
    category: "",
    authors:[],
    author:"",
    shipping: "",
    quantity: "",
    images: [],
    lingos:["English", "Kannada", "Hindi", "Tamil", "Telugu","Malayalam"],
    lingo:""
  };

    const ProductCreate = () => {
        const [values, setValues] = useState(initialState);
        const [loading,setLoading] =useState(false)
        // redux
        const { user } = useSelector((state) => ({ ...state }));

        useEffect(() => {
          loadValues();
        },[]);

        const loadValues=()=>{
          let p1 = loadCategories()
          let p2 = loadAuthors();

          Promise.all([p1, p2]).then(() => {
            setValues({ ...values, categories: categoryData, authors: authorsData })
          })
        }

        const loadCategories = () => {
          return new Promise((resolve, reject) => {
          getCategories().then((c) => {
            categoryData = c.data;
              resolve(c.data)
          });
        })
      }
           const loadAuthors = () => {
             return new Promise((resolve, reject) => {
              getAuthors().then((d) => {
                authorsData = d.data;
                resolve();
              });
             })
           }
        
        const handleSubmit = (e) => { 
          e.preventDefault();
          createProduct(values, user.token)
            .then((res) => {
              console.log(res);
              window.alert(`"${res.data.title}" is created`);
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
              // if (err.response.status === 400) toast.error(err.response.data);
              toast.error(err.response.data.err);
            });
        };
      
      const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
        //spread initial state, name could be anything descrpt, price etc.. here we are dynamically upating array
      };
     
      const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log("CLICKED CATEGORY", e.target.value);
        setValues({ ...values,  category: e.target.value });
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
            <h4>Product create</h4>
          )}
          <hr />    
          
          <div className="p=3">
            <FileUpload values={values} setValues={setValues} setLoading={setLoading}/>
          </div>
          <ProductCreateForm handleSubmit={handleSubmit} handleChange={handleChange} setValues={setValues} 
          values={values} handleCategoryChange={handleCategoryChange} handleAuthorChange={handleAuthorChange}/>
           </div>
      </div>
    </div>
  );
};

export default ProductCreate;
