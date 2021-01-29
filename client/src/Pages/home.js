import React from 'react';
import Jumbotron from '../components/cards/jumbotron';
import NewArrivals from '../components/home/newarrival';
import BestSellers from '../components/home/bestsellers';
import CategoryList from '../components/category/categorylist';
import '../components/nav/header.css'
const Home = () => {
    return (
      <>
        <div className="company jumbotron text-info h1 font-weight-bold text-center ">
          <Jumbotron text={["EBIBLIO"] } />
        </div>
  
        <h4 className="text-center p-3 mt-5 mb-5 display-4 text-success font-weight-bold jumbotron">
          New Arrivals
        </h4>
        <NewArrivals />
  
        <h4 className="text-center p-3 mt-5 mb-5 display-4 text-success font-weight-bold jumbotron">
          Best Sellers
        </h4>
        <BestSellers />

        <h4 className="text-center p-3 mt-5 mb-5 display-4 text-success font-weight-bold jumbotron">
          Category
        </h4>
        <CategoryList />

        <br />
        <br />
      </>
    );
  };
  
  export default Home;
  