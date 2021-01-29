import React from "react";
import { Link } from "react-router-dom";


const ProductListItems = ({ product }) => {
  const {
    price,
    category,
    author,
    shipping,
    lingo,
    quantity,
    sold,
  } = product;

  return (
    <ul className="list-group">
      <li className="list-group-item">
        Price{" "}
        <span className="label label-default label-pill pull-xs-right">
         Rs. {price}
        </span>
      </li>

      {category && (
        <li className="list-group-item">
          Category{" "}
          <Link
            to={`/category/${category.slug}`}
            className="label label-default label-pill pull-xs-right"
          >
            {category.name}
          </Link>
        </li>
      )}

      {author && (
        <li className="list-group-item">
          Author{" "}
          <Link
            to={`/author/${author.slug}`}
            className="label label-default label-pill pull-xs-right"
          >
            {author.name}
          </Link>
        </li>
      )}

      <li className="list-group-item">
        Shipping{" "}
        <span className="label label-default label-pill pull-xs-right">
          {shipping}
        </span>
      </li>

      <li className="list-group-item">
        Language{" "}
        <span className="label label-default label-pill pull-xs-right">
          {lingo}
        </span>
      </li>

      <li className="list-group-item">
        Available{" "}
        <span className="label label-default label-pill pull-xs-right">
          {quantity}
        </span>
      </li>

      <li className="list-group-item">
        Sold{" "}
        <span className="label label-default label-pill pull-xs-right">
          {sold}
        </span>
      </li>
    </ul>
  );
};

export default ProductListItems;
