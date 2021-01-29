import React, { useState, useEffect } from "react";
import { getProductsByCount ,fetchProductsByFilter} from "../functions/product";
import { getAuthors } from "../functions/author";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/productcard";
import { Menu, Slider, Checkbox ,Radio} from "antd";
import { StarOutlined, DownSquareOutlined } from "@ant-design/icons";
import Star from "../components/form/star";
import { getCategories } from "../functions/category";

const { SubMenu} = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [lingos, setLingos] = useState(["English", "Kannada", "Hindi", "Tamil", "Telugu","Malayalam" ]);
  const [lingo, setLingo] = useState("");
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [authors, setAuthors] = useState([]); 
  const [authorIds, setAuthorIds] = useState([]); //this will be sent to backend to fetch products
  const [star, setStar] = useState("");
  const [shipping, setShipping] = useState("");

  let dispatch = useDispatch();
  let { search } = useSelector((state) => ({ ...state }));  //get search from redux
  const { text } = search;  //fetcht text property from redux

  useEffect(() => {
    loadAllProducts();
    getCategories().then((res)=> setCategories(res.data));
    getAuthors().then((res) => setAuthors(res.data));
  }, []);


  const fetchProducts = (arg) => {   //text as args
    fetchProductsByFilter(arg).then((res) => { //got to fnction/prodcut to fetch items as text as args
      setProducts(res.data);  //
    });
  };

  // 1. load products by default on page load when user directly clicks on shop or seaech witjhput entering
  const loadAllProducts = () => {
    getProductsByCount(12).then((p) => {   //12 products list
      setProducts(p.data);
      setLoading(false);
    });
  };

  // 2. load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => { //delaying request by few ms so tht there will not be many api request 
      fetchProducts({ query: text}); 
      if(!text){
        loadAllProducts();
      }
      //send text ,in backend we are expecting it as query 
    }, 100); //3 secs delay so that on avg if user enters 2-3 letters api req can be send at once rather than latter 
    return () => clearTimeout(delayed);
  }, [text]);   //mount when each text(letter) is entered/chaged  everytime fetch from redux store 

  // 3. load products based on price range
  useEffect(() => {
    console.log("ok to request");
    fetchProducts({ price });
  }, [ok]);  //when user stops sliding ok will become true and then mount

  // 4. load products based on category

  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheckCategory}
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          checked={categoryIds.includes(c._id)} //fetch id which is clicked so that it can be used for multipl sel
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

     
  
    const handleSlider = (value) => {
      setPrice([0, 100]);
      dispatch({
        type: "SEARCH_QUERY",   //reset text by dispatching
        payload: { text: "" },
      });
      setCategoryIds([]);
      setAuthorIds([])
    setPrice(value);
    setStar("");
    setLingo("");
    setShipping("");
      setTimeout(() => {
        setOk(!ok);  //here useer stopped sliding , so now make ok as true every 3s
      }, 300);
    };

     // 7. show products based on languages
  const showLingos = () =>
  lingos.map((b) => (
    <Radio
      key={b}
      value={b}
      name={b}
      checked={b === lingo}
      onChange={handleLingo}
      className="pb-1 pl-4 pr-4"
    >
      {b}
    </Radio>
  ));

const handleLingo = (e) => {
  dispatch({
    type: "SEARCH_QUERY",
    payload: { text: "" },
  });
  setPrice([0, 0]);
    setCategoryIds([]);
    setAuthorIds([]);
    setStar("");
    setLingo(e.target.value);
    setShipping("");
  fetchProducts({ lingo: e.target.value });
};

  //category
  const handleCheckCategory = (e) => {
    dispatch({
      type: "SEARCH_QUERY",   //reset text by dispatching
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setStar("");
    setAuthorIds([]);
    setLingo("");
    setShipping("");
    let inTheState = [...categoryIds]; //spread all the values of category
    let justChecked = e.target.value;  //when user checks or unckeks
    let foundInTheState = inTheState.indexOf(justChecked); // index or -1

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      // if found pull out one item from index
      inTheState.splice(foundInTheState, 1);
    }
    setCategoryIds(inTheState);
    fetchProducts({ category: inTheState });
  };

  // 5. show products by star rating
  const handleStarClick = (num) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar(num);
    setShipping("")
    setLingo("");
    fetchProducts({ stars: num });
  };

  //shipping
  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="Yes"
        checked={shipping === "Yes"}
      >
        Yes
      </Checkbox>

      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="No"
        checked={shipping === "No"}
      >
        No
      </Checkbox>
    </>
  );

  const handleShippingchange = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setShipping(e.target.value);
    fetchProducts({ shipping: e.target.value });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />

          <Menu defaultOpenKeys={["1", "2","3","4","5"]} mode="inline">
            <SubMenu
              key="1" //open by default
              title={
                <span className="h6">
                   Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `${v} Rs`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="4999"
                />
              </div>
            </SubMenu>

            {/* category */}
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Genres  {/* down arrow kindaa */}
                </span>
              }
            >
              <div style={{ maringTop: "-10px" }}>{showCategories()}</div>
            </SubMenu>

            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Languages
                </span>
              }
            >
              <div style={{ maringTop: "-10px" }} className="pl-4 pr-5 ">
                {showLingos()}
              </div>
            </SubMenu>

           {/* stars */}
           <SubMenu
              key="4"
              title={
                <span className="h6">
                  <StarOutlined /> Rating
                </span>
              }
            >
              <div style={{ maringTop: "-10px" }}>{showStars()}</div>
            </SubMenu>
            
           {/* shipping */}
           <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Shipping
                </span>
              }
            >
              <div style={{ maringTop: "-10px" }} className="pr-5">
                  {showShipping()}
                  </div>
                  </SubMenu>
                  </Menu>
                </div>
                
        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}

          {products.length < 1 && <p>No products found</p>}

          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
