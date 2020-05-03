import React from "react";
import Layer from "../components/Layer";
import Preview from "../components/Preview";
import Toolbar from "../components/Toolbar";
import { store } from "../store";

function Home({ context, instruments }) {
  const { state } = React.useContext(store);

  return (
    <div className="App">
      <Toolbar context={context} instruments={instruments} />
      <div className="wrapper">
        {state.claves.map(clave => (
          <Layer key={clave.id} clave={clave} />
        ))}
        <Preview />
      </div>
    </div>
  );
}

export default Home;
