import { useEffect, useState } from "react";
import Home, { useTestContext } from "./Home/Index";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import test from "/test.png";
import test1 from "/test.svg";

function App() {
  useEffect(() => {
    let id = "src/Home1";
    let string = new RegExp(`^${new RegExp(id)}`);
    console.log(string);
  }, []);
  return (
    <div
      style={{
        height: "100vh",
        width: "100vh",
      }}
    >
      <img
        style={{
          width: "80px",
        }}
        src={test}
      />
      <img
        style={{
          width: "80px",
        }}
        src={test1}
      />
      <Allotment vertical={true}>
        <Allotment.Pane minSize={200}>
          <Allotment>
            <Allotment.Pane minSize={200}>
              <div>Pane 1,test over</div>
              <div>Pane 1,test over</div>
              <div>Pane 1,test over</div>
            </Allotment.Pane>
            <Allotment.Pane minSize={200}>
              <div>Pane 1</div>
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane minSize={200}>
          <div>Pane 1</div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default App;
