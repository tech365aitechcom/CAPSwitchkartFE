import { createSlice } from "@reduxjs/toolkit";

// Define the initial state of your QNA object
const initialState = {
  Core: [],
  Cosmetics: [],
  Accessories: [],
  Display: [],
  //Functional: [],
  "Functional Major": [],
  "Functional Minor": [],
  Warranty: [],
};

// Create a slice for the QNA object
const qnaSlice = createSlice({
  name: "QNA",
  initialState,
  reducers: {
    setGroupAnswers: (state, action) => {
      const { group, answers } = action.payload;
      state[group] = answers;
    },
    updateCoreObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      let loopEntered = false;
      state.Core[index].selected[selectedIndex] =
        !state.Core[index].selected[selectedIndex];
      state.Core[index].selected.forEach((element) => {
        if (element) {
          if (state.Core[index]) {
            state.Core[index].answer = yesKey;
            state.Core[index].key = "yes";
            loopEntered = true;
          }
        }
      });
      if (!loopEntered) {
        if (state.Core[index]) {
          state.Core[index].answer = noKey;
          state.Core[index].key = "no";
          loopEntered = false;
        }
      }
    },
    updateCosmeticsObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      let loopEntered = false;
      state.Cosmetics[index].selected[selectedIndex] =
        !state.Cosmetics[index].selected[selectedIndex];
      state.Cosmetics[index].selected.forEach((element) => {
        if (element) {
          if (state.Cosmetics[index]) {
            state.Cosmetics[index].answer = yesKey;
            state.Cosmetics[index].key = "yes";
            loopEntered = true;
          }
        }
      });
      if (!loopEntered) {
        if (state.Cosmetics[index]) {
          state.Cosmetics[index].answer = noKey;
          state.Cosmetics[index].key = "no";
          loopEntered = false;
        }
      }
    },
    updateAccessoriesObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      let loopEntered = false;
      state.Accessories[index].selected[selectedIndex] =
        !state.Accessories[index].selected[selectedIndex];
      state.Accessories[index].selected.forEach((element) => {
        if (element) {
          if (state.Accessories[index]) {
            state.Accessories[index].answer = yesKey;
            state.Accessories[index].key = "yes";
            loopEntered = true;
          }
        }
      });
      if (!loopEntered) {
        if (state.Accessories[index]) {
          state.Accessories[index].answer = noKey;
          state.Accessories[index].key = "no";
          loopEntered = false;
        }
      }
    },
    updateDisplayObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      let loopEntered = false;
      state.Display[index].selected[selectedIndex] =
        !state.Display[index].selected[selectedIndex];
      state.Display[index].selected.forEach((element) => {
        if (element) {
          if (state.Display[index]) {
            state.Display[index].answer = yesKey;
            state.Display[index].key = "yes";
            loopEntered = true;
          }
        }
      });
      if (!loopEntered) {
        if (state.Display[index]) {
          state.Display[index].answer = noKey;
          state.Display[index].key = "no";
          loopEntered = false;
        }
      }
    },
    updateFunctionalObject: (state, action) => {
      const { index, newAnswer, newKey } = action.payload;
      if (state.Functional[index]) {
        state.Functional[index].answer = newAnswer;
        state.Functional[index].key = newKey;
      }
    },
    updateFunctionalMajorObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      let loopEntered = false;
      state["Functional Major"][index].selected[selectedIndex] =
        !state["Functional Major"][index].selected[selectedIndex];
      state["Functional Major"][index].selected.forEach((element) => {
        if (element) {
          if (state["Functional Major"][index]) {
            state["Functional Major"][index].answer = yesKey;
            state["Functional Major"][index].key = "yes";
            loopEntered = true;
          }
        }
      });
      if (!loopEntered) {
        if (state["Functional Major"][index]) {
          state["Functional Major"][index].answer = noKey;
          state["Functional Major"][index].key = "no";
          loopEntered = false;
        }
      }
    },
    updateFunctionalMinorObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      let loopEntered = false;
      state["Functional Minor"][index].selected[selectedIndex] =
        !state["Functional Minor"][index].selected[selectedIndex];
      state["Functional Minor"][index].selected.forEach((element) => {
        if (element) {
          if (state["Functional Minor"][index]) {
            state["Functional Minor"][index].answer = yesKey;
            state["Functional Minor"][index].key = "yes";
            loopEntered = true;
          }
        }
      });
      if (!loopEntered) {
        if (state["Functional Minor"][index]) {
          state["Functional Minor"][index].answer = noKey;
          state["Functional Minor"][index].key = "no";
          loopEntered = false;
        }
      }
    },
    updateWarrantyObject: (state, action) => {
      const { index, newAnswer, newKey } = action.payload;

      if (state.Warranty[index]) {
        state.Warranty[index].answer = newAnswer;
        state.Warranty[index].key = newKey;
        state.Warranty[index].selected[0] = !state.Warranty[index].selected[0];
      }

      for (let item = 0; item < state.Warranty.length; item++) {
        if (
          item !== index &&
          state.Warranty[item].quetion !== "Above 11 months"
        ) {
          state.Warranty[item].answer = "W2";
          state.Warranty[item].key = "no";
          state.Warranty[item].selected[0] = false;
        } else if (
          item !== index &&
          state.Warranty[item].quetion === "Above 11 months"
        ) {
          state.Warranty[item].answer = "W1";
          state.Warranty[item].key = "no";
          state.Warranty[item].selected[0] = false;
        }
      }
    },
    resetState: (state, action) => {
      if (action.type === "RESET_STATE") {
        return initialState;
      } else {
        return state;
      }
    },
  },
});

export const {
  setGroupAnswers,
  updateCoreObject,
  updateCosmeticsObject,
  updateAccessoriesObject,
  updateDisplayObject,
  updateFunctionalObject,
  updateFunctionalMajorObject,
  updateFunctionalMinorObject,
  updateWarrantyObject,
  resetState,
} = qnaSlice.actions;

export default qnaSlice.reducer;
