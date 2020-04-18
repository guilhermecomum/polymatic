import shortid from "shortid";

const presets = {
  [shortid.generate()]: {
    name: "Rumba",
    instruments: [
      { sequence: "1001000100101000", tempo: 120, sample: "conga1" }
    ]
  },
  [shortid.generate()]: {
    name: "Centro de gravidade",
    instruments: [
      {
        sequence: "10101",
        tempo: 120,
        sample: "bumbo"
      },
      {
        sequence: "10110101",
        tempo: 120,
        sample: "bass"
      }
    ]
  }
};

export default presets;
