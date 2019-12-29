import React, { useState, useEffect } from "react";
import axios from "axios";

const fetchValues = async () => await axios.get("/api/values/current");
const fetchIndexes = async () => await axios.get("/api/values/all");
const postValue = async index => {
  if (typeof index === "undefined") {
    return Promise.reject(new Error("No value defined"));
  }
  return await axios.post("/api/values", { index });
};

const toIndexes = (list = []) => list.map(({ number }) => number).join(", ");
const toValues = (list = {}) =>
  Object.keys(list).map((key, index) => (
    <div key={key}>
      For index {key} I calculated {list[key]}
    </div>
  ));

const Fib = () => {
  const [value, setValue] = useState("");
  const [state, setState] = useState({
    seenIndexes: [],
    values: {},
    index: ""
  });

  const onSubmitHandler = async e => {
    e.preventDefault();
    try {
      await postValue(value);
    } catch (e) {
      console.error(e);
    }
    setState({ ...state, index: value });
    setValue("");
  };

  useEffect(() => {
    (async () => {
      const { data: values } = await fetchValues();
      const { data: seenIndexes } = await fetchIndexes();
      setState({
        ...state,
        seenIndexes,
        values
      });
    })();
  }, [state.index]);

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <div>
          <label>Enter your index:</label>
          <input
            type="text"
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
      <h3>Indexes I have seen:</h3>
      {toIndexes(state.seenIndexes)}

      <h3>Calculated values:</h3>
      {toValues(state.values)}
    </div>
  );
};

export default Fib;
