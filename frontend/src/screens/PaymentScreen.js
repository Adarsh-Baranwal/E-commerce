import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormContainer from "../components/FormContainer";
import { Form, Button, Col, Row } from "react-bootstrap";
import { savePaymentMethod } from "./../actions/cartAction";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentScreen = (props) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    props.history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    props.history.push("/placeorder");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h2>Payment Method</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-3">
          <Form.Label as="legend">Select Method</Form.Label>
          <Row>
            <Col className="my-3">
              <Form.Check
                type="radio"
                label="PayPal or Credit Card"
                id="paypal"
                name="paymentMethod"
                value="PayPal"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Row>
        </Form.Group>
        <Button type="submit" variant="primary" className="btn-block">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
