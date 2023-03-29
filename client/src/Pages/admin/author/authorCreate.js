import React,{useState,useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {createAuthor,getAuthors} from "../../../functions/author";
import { Link } from "react-router-dom";
import { EditOutlined} from "@ant-design/icons";

const AuthorCreate = () => {
  //extracts data from redux store
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
   //for search filter 
   const [keyword,setKeyword]=useState("");
   
  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = () =>
    getAuthors().then((c) => setAuthors(c.data));
    
    const handleSubmit = (e) => {
      e.preventDefault();
      // console.log(name);
      setLoading(true);
      createAuthor({ name }, user.token)
        .then((res) => {
          // console.log(res)
          setLoading(false);
          setName("");
          toast.success(`"${res.data.name}" is created`);
          //load all the categories after creating one 
          loadAuthors();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          if (err.response.status === 400) toast.error(err.response.data);
        });
    };
    
   
  
    const authorForm = () => (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
            value={name}
            autoFocus
            required
          />
          <br />
          <button className="btn btn-outline-primary">Save</button>
        </div>
      </form>
    );

    const handleSearchChange = (e) => {
      e.preventDefault();
      setKeyword(e.target.value.toLowerCase());
    };
  
    // step 4
    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
          </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Create Author</h4>
          )}
          {authorForm()}
          {/* step 2 for search filter users can type search query */}
          <input type="search" placeholder="Filter" value={keyword} onChange={handleSearchChange} 
          className="form-control mb-4" />

          <hr />
          {authors.filter(searched(keyword)).map((c)=> (//filter item written in searched function which is keyword
            <div className="alert alert-secondary" key={c._id}>
              {c.name}
              
              <Link to={`/admin/author/${c.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default AuthorCreate;
