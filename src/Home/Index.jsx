import React, { createContext, useContext, useState } from "react";

const TestContext = createContext();
console.log(TestContext);

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw Error("useTestContext must be used within a TestContextProvider");
  }
  return context;
};

function Home(props) {
  const [count, setCount] = useState(0);
  const value = {
    count,
    setCount,
  };
  return (
    <TestContext.Provider value={value}>{props.children}</TestContext.Provider>
  );
}

export default Home;
