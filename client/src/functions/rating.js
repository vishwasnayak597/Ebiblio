//for average star rating
import React from "react";
import StarRating from "react-star-ratings";

export const showAverage = (p) => {
  if (p && p.ratings) {  
    let ratingsArray = p && p.ratings; 
    let total = [];
    let length = ratingsArray.length;
    

    ratingsArray.map((r) => total.push(r.star));  //push star valueto total array
    let totalReduced = total.reduce((p, n) => p + n, 0); //previous and next value [1,4,6,7]--1+4=5+6=11+7=20(prev+nxt)
    //console.log("totalReduced", totalReduced);  //0 init value

    let highest = length * 5;  //possible highest rating if everyone gives 5
    //console.log("highest", highest);

    let result = (totalReduced * 5) / highest;   
    //console.log("result", result);

    return (
      <div className="text-center pt-1 pb-3">
        <span>
        <StarRating
            starDimension="20px"
            starSpacing="2px"
            starRatedColor="red"
            rating={result}
            editing={false}
          />{" "}
          ({p.ratings.length})
        </span>
      </div>
    );
  }
};
