import React from "react";
import { Card } from "antd";
import Book1 from '../../images/book1.jpg';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Meta } = Card;

const AdminProductCard = ({ product,handleRemove }) => {
  // destructure
  const { title, description, images,slug } = product;  //show only title,desc,img for admin

  return (
    <Card
      cover={
        <img   //design code from ant card
          src={images && images.length ? images[0].url :Book1}
          style={{ height: "150px", objectFit: "cover" }}
          className="p-1" alt="book"
        />
      }
      actions={[
        <Link to={`/admin/product/${slug}`}>
          <EditOutlined className="text-warning" />
        </Link>,
        <DeleteOutlined 
        onClick={() => handleRemove(slug)} //arrow functions so that only after click it celetes
          className="text-danger" />,
      ]}
    >
      <Meta title={title}  description={`${description && description.substring(0, 40)}...`} />
    </Card>
  );
};

export default AdminProductCard;
