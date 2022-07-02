import React from "react";
import Rating from "./Rating";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = (props) => {
  return (
    <>
      <Card className="my-3 p-3 rounded">
        <Link to={`product/${props.product._id}`}>
          <Card.Img src={props.product.image} variant="top" />
        </Link>
        <Card.Body>
          <Link
            className="text-decoration-none"
            to={`product/${props.product._id}`}
          >
            <Card.Title as="div">
              <strong>{props.product.name}</strong>
            </Card.Title>
          </Link>
          <Card.Text as="div">
            <div className="my-3">
              <Rating
                rating={props.product.rating}
                numReviews={props.product.numReviews}
                color="red"
              ></Rating>
            </div>
          </Card.Text>
          <Card.Text as="div">
            <h3>Rs. {props.product.price}</h3>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default Product;
