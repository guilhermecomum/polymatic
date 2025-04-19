import shortid from "shortid";

const presets = {
  [shortid.generate()]: {
    name: "Toque Ignbin",
    instruments: [{ sequence: "101101011010", tempo: 120, sample: "conga1" }]
  },
  [shortid.generate()]: {
    name: "Son cubano",
    instruments: [
      {
        sequence: "1001001000101000",
        tempo: 92,
        sample: "claves"
      }
    ]
  },
  [shortid.generate()]: {
    name: "Rumba",
    instruments: [
      { sequence: "1001000100101000", tempo: 110, sample: "claves" }
    ]
  },
  [shortid.generate()]: {
    name: "Samba",
    instruments: [
      { sequence: "1011010101101010", tempo: 60, sample: "tamborim" }
    ]
  }
};

export default presets;
