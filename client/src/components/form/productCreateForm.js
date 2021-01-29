import React from "react";

const ProductCreateForm = ({
  handleSubmit,
  handleChange,
  values,
  handleCategoryChange,
  handleAuthorChange
}) => {
  // destructure
  const {
    title,
    description,
    review,
    price,
    categories,
    authors,
    quantity,
     lingos,
  
  } = values;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={title}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          className="form-control"
          value={description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={price}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Shipping</label>
        <select
          name="shipping"
          className="form-control"
          onChange={handleChange}
        >
          <option>Please select</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          className="form-control"
          value={quantity}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Language</label>
        <select name="lingo" className="form-control" onChange={handleChange}>
          <option>Please select</option>
          {lingos.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>


      <div className="form-group">
        <label>Author</label>
        <select
          name="author"
          className="form-control"
          onChange={handleAuthorChange}
        >
          <option>Please select</option>
          {authors.length > 0 &&
            authors.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          name="category"
          className="form-control"
          onChange={handleCategoryChange}
        >
          <option>Please select</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
     
      <div className="form-group">
        <label>Review</label>
        <input
          type="text"
          name="review"
          className="form-control"
          value={review}
          onChange={handleChange}
        />
      </div>

      <br />
      <button className="btn btn-outline-info">Save</button>
    </form>
  );
};

export default ProductCreateForm;
