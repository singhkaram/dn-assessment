import { useEffect, useState, useId } from "react";
import styles from "./App.module.css";
import UserForm from "./components/UserForm";
import { Resizable } from "re-resizable";
import axios from "axios";

function App() {
  const id = useId();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:9000/count");
    console.log(response);
    if (response.status === 200) {
    }
    setData(response.data);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  const handleReset = async () => {
    try {
      const response = await axios.post("http://localhost:9000/count/reset");
      console.log(response);
      if (response.status === 200) {
      }
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className={styles.flexContainer}>
        <Resizable
          key={id}
          defaultSize={{
            width: "40%",
          }}
          className={styles.resizable}
        >
          <UserForm />
        </Resizable>
        <Resizable
          key={id}
          defaultSize={{
            width: "60%",
          }}
          className={styles.resizable}
        >
          <UserForm />
        </Resizable>
      </div>
      <Resizable
        key={id}
        defaultSize={{
          width: "100%",
        }}
        className={styles.resizable}
      >
        <UserForm />
      </Resizable>
      <div className={styles.countContainer}>
        count: {data.count}
        <button onClick={handleReset}>Reset</button>
      </div>
    </>
  );
}

export default App;
