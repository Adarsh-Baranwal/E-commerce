import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "./../components/Message";
import Loader from "./../components/Loader";
import { login } from "./../actions/userAction";
import FormContainer from "../components/FormContainer";
import { Link } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";

const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "";

  useEffect(() => {
    if (userInfo) {
      props.history.push(`/${redirect}`);
    }
  }, [props.history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    //DISPATCH LOGIN
    dispatch(login(email, password));
  };
  return (
    <FormContainer>
      <h1>Sign-In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader></Loader>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button className="my-3" type="submit" variant="primary">
          Sign In
        </Button>
        <Row className="py-3">
          <Col>
            New User?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : `/register`}
            >
              Register
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
