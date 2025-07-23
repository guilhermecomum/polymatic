import React, { useEffect, useContext } from "react";
import Layer from "../components/Clave";
import Preview from "../components/Preview";
import Toolbar from "../components/Toolbar";
import shortid from "shortid";
import { store } from "../store";
import { useLocation } from "react-router-dom";
import Clave from "../lib/clave";

function Home() {
  const { state, dispatch } = useContext(store);
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const guias = query.get("guias");
  const claves = JSON.parse(guias);

  useEffect(() => {
    async function handlePreset(claves) {
      await claves.forEach((preset) => {
        const { sequence, tempo, sample } = preset;
        const clave = new Clave(
          sequence,
          tempo,
          sample,
          state.samplers.get(sample)
        );
        return dispatch({
          type: "claves.add",
          id: shortid.generate(),
          clave,
        });
      });
    }

    if (claves) {
      handlePreset(claves);
    }
  }, [guias]);

  return (
    <div className="App">
      <Toolbar />
      <div className="wrapper">
        {state.claves.map((clave) => (
          <Layer key={clave.id} clave={clave} />
        ))}
        {state.previewVisibility && <Preview />}
      </div>
    </div>
  );
}

export default Home;
