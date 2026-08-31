import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../features/auth/authSlice";

import "../styles/SignIn.css";

function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      loginUser({
        email,
        password,
      }),
    );

    return <main></main>;
  };
}

export default User;
