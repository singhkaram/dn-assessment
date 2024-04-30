import axios from "axios";
import styles from "./userForm.module.css";
import { useEffect, useState } from "react";
import { URL } from "../config";

function UserForm() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "",
    age: "",
    editing: false,
  });
  console.log("🚀 ~ App ~ error:", error);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${URL}/users`);
      console.log(response);
      if (response.status === 200) {
        setError(null);
      }
      setData(response.data);
    } catch (error) {
      setError(error);
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("🚀 ~ handleSubmit working ~ event:", event);
    const { name, email, age } = event.target.elements;
    const payload = {
      name: name.value,
      email: email.value,
      age: age.value,
    };
    console.log("🚀 ~ App ~ handleSubmit ~ payload:", payload);
    try {
      if (user.editing) {
        const response = await axios.put(
          `${URL}/users/${user._id}`,
          payload
        );
        console.log(response);
        if (response.status === 200) {
          setError(null);
          setUser({
            _id: "",
            name: "",
            email: "",
            age: "",
            editing: false,
          });
          fetchData();
        }
        setData(
          data.map((user) => {
            if (user._id === payload._id) {
              return response.data;
            }
            return user;
          })
        );
      } else {
        const response = await axios.post(
          `${URL}/users`,
          payload
        );
        console.log(response);
        if (response.status === 201) {
          setError(null);
        }
        setData([...data, response.data]);
      }
    } catch (error) {
      setError(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${URL}/users/${id}`);
      console.log(response);
      if (response.status === 200) {
        setError(null);
      }
      setData(data.filter((user) => user._id !== id));
    } catch (error) {
      setError(error);
    }
  };

  const handleEdit = async (id) => {
    const user = data.find((user) => user._id === id);
    setUser({ ...user, editing: true });
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevProps) => ({
      ...prevProps,
      [name]: value,
    }));
  };

  return (
    <div className={styles.userFormContainer}>
      {error ? (
        <div className={styles.error}>Something went wrong</div>
      ) : (
        <>
          <form className={styles.userForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Name"
                value={user.name}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                value={user.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                name="age"
                required
                placeholder="Age"
                value={user.age}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
          <table className={styles.UserTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td>
                    <button onClick={() => handleEdit(user._id)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default UserForm;
