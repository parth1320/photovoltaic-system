import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/setHeader";

const id = localStorage.getItem("id");

const UserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`http://localhost:5000/user/${id}`)
      .then((response) => {
        const user = response.data;
        setName(user.name);
        setEmail(user.email);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post(`http://localhost:5000/userUpdate/${id}`, { name, email })
      .then((response) => {
        const updatedUser = response.data;
        setName(updatedUser.name);
        setEmail(updatedUser.email);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </>
  );
};

export default UserProfile;
