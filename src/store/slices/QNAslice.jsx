import { createSlice } from "@reduxjs/toolkit";

// Dynamic initial state - will be populated from API
const initialState = {
  groups: {}, // Will store all groups dynamically: { "Core": [], "Display": [], "Test Group": [], etc. }
  groupNames: [], // Will store the order of group names
  isInitialized: false, // Track if groups have been initialized
};

// Create a slice for the QNA object
const qnaSlice = createSlice({
  name: "QNA",
  initialState,
  reducers: {
    // Initialize groups dynamically from API response
    initializeGroups: (state, action) => {
      const { groupNames } = action.payload;

      // Reset groups object
      state.groups = {};
      state.groupNames = groupNames;

      // Create empty array for each group
      groupNames.forEach((groupName) => {
        state.groups[groupName] = [];
      });

      state.isInitialized = true;
    },

    // Set answers for a specific group
    setGroupAnswers: (state, action) => {
      const { group, answers } = action.payload;
      if (state.groups[group] !== undefined) {
        state.groups[group] = answers;
      }
    },

    // Generic update function for any group with toggle behavior
    updateGroupObject: (state, action) => {
      const { group, index, noKey, yesKey, selectedIndex } = action.payload;

      if (!state.groups[group] || !state.groups[group][index]) {
        return;
      }

      let loopEntered = false;

      // Toggle the selected state
      state.groups[group][index].selected[selectedIndex] =
        !state.groups[group][index].selected[selectedIndex];

      // Check if any option is selected
      state.groups[group][index].selected.forEach((element) => {
        if (element) {
          state.groups[group][index].answer = yesKey;
          state.groups[group][index].key = "yes";
          loopEntered = true;
        }
      });

      // If nothing selected, set to no
      if (!loopEntered) {
        state.groups[group][index].answer = noKey;
        state.groups[group][index].key = "no";
      }
    },

    // Update function for groups with simple answer (like old Functional)
    updateGroupObjectSimple: (state, action) => {
      const { group, index, newAnswer, newKey } = action.payload;

      if (!state.groups[group] || !state.groups[group][index]) {
        return;
      }

      state.groups[group][index].answer = newAnswer;
      state.groups[group][index].key = newKey;
    },

    // Special update for Warranty group (maintains existing behavior)
    updateWarrantyObject: (state, action) => {
      const { index, newAnswer, newKey } = action.payload;
      const warrantyGroup = state.groups["Warranty"];

      if (!warrantyGroup || !warrantyGroup[index]) {
        return;
      }

      warrantyGroup[index].answer = newAnswer;
      warrantyGroup[index].key = newKey;
      warrantyGroup[index].selected[0] = !warrantyGroup[index].selected[0];

      // Reset all other warranty items
      for (let item = 0; item < warrantyGroup.length; item++) {
        if (item !== index) {
          if (warrantyGroup[item].quetion !== "Above 11 months") {
            warrantyGroup[item].answer = "W2";
            warrantyGroup[item].key = "no";
            warrantyGroup[item].selected[0] = false;
          } else {
            warrantyGroup[item].answer = "W1";
            warrantyGroup[item].key = "no";
            warrantyGroup[item].selected[0] = false;
          }
        }
      }
    },

    // Backward compatible individual update functions for existing groups
    updateCoreObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      const coreGroup = state.groups["Core"];

      if (!coreGroup || !coreGroup[index]) {
        return;
      }

      let loopEntered = false;
      coreGroup[index].selected[selectedIndex] =
        !coreGroup[index].selected[selectedIndex];

      coreGroup[index].selected.forEach((element) => {
        if (element) {
          coreGroup[index].answer = yesKey;
          coreGroup[index].key = "yes";
          loopEntered = true;
        }
      });

      if (!loopEntered) {
        coreGroup[index].answer = noKey;
        coreGroup[index].key = "no";
      }
    },

    updateCosmeticsObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      const cosmeticsGroup = state.groups["Cosmetics"];

      if (!cosmeticsGroup || !cosmeticsGroup[index]) {
        return;
      }

      let loopEntered = false;
      cosmeticsGroup[index].selected[selectedIndex] =
        !cosmeticsGroup[index].selected[selectedIndex];

      cosmeticsGroup[index].selected.forEach((element) => {
        if (element) {
          cosmeticsGroup[index].answer = yesKey;
          cosmeticsGroup[index].key = "yes";
          loopEntered = true;
        }
      });

      if (!loopEntered) {
        cosmeticsGroup[index].answer = noKey;
        cosmeticsGroup[index].key = "no";
      }
    },

    updateAccessoriesObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      const accessoriesGroup = state.groups["Accessories"];

      if (!accessoriesGroup || !accessoriesGroup[index]) {
        return;
      }

      let loopEntered = false;
      accessoriesGroup[index].selected[selectedIndex] =
        !accessoriesGroup[index].selected[selectedIndex];

      accessoriesGroup[index].selected.forEach((element) => {
        if (element) {
          accessoriesGroup[index].answer = yesKey;
          accessoriesGroup[index].key = "yes";
          loopEntered = true;
        }
      });

      if (!loopEntered) {
        accessoriesGroup[index].answer = noKey;
        accessoriesGroup[index].key = "no";
      }
    },

    updateDisplayObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      const displayGroup = state.groups["Display"];

      if (!displayGroup || !displayGroup[index]) {
        return;
      }

      let loopEntered = false;
      displayGroup[index].selected[selectedIndex] =
        !displayGroup[index].selected[selectedIndex];

      displayGroup[index].selected.forEach((element) => {
        if (element) {
          displayGroup[index].answer = yesKey;
          displayGroup[index].key = "yes";
          loopEntered = true;
        }
      });

      if (!loopEntered) {
        displayGroup[index].answer = noKey;
        displayGroup[index].key = "no";
      }
    },

    updateFunctionalMajorObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      const functionalMajorGroup = state.groups["Functional Major"];

      if (!functionalMajorGroup || !functionalMajorGroup[index]) {
        return;
      }

      let loopEntered = false;
      functionalMajorGroup[index].selected[selectedIndex] =
        !functionalMajorGroup[index].selected[selectedIndex];

      functionalMajorGroup[index].selected.forEach((element) => {
        if (element) {
          functionalMajorGroup[index].answer = yesKey;
          functionalMajorGroup[index].key = "yes";
          loopEntered = true;
        }
      });

      if (!loopEntered) {
        functionalMajorGroup[index].answer = noKey;
        functionalMajorGroup[index].key = "no";
      }
    },

    updateFunctionalMinorObject: (state, action) => {
      const { index, noKey, yesKey, selectedIndex } = action.payload;
      const functionalMinorGroup = state.groups["Functional Minor"];

      if (!functionalMinorGroup || !functionalMinorGroup[index]) {
        return;
      }

      let loopEntered = false;
      functionalMinorGroup[index].selected[selectedIndex] =
        !functionalMinorGroup[index].selected[selectedIndex];

      functionalMinorGroup[index].selected.forEach((element) => {
        if (element) {
          functionalMinorGroup[index].answer = yesKey;
          functionalMinorGroup[index].key = "yes";
          loopEntered = true;
        }
      });

      if (!loopEntered) {
        functionalMinorGroup[index].answer = noKey;
        functionalMinorGroup[index].key = "no";
      }
    },

    resetState: (state) => {
      // Reset to initial state
      state.groups = {};
      state.groupNames = [];
      state.isInitialized = false;
    },
  },
});

export const {
  initializeGroups,
  setGroupAnswers,
  updateGroupObject,
  updateGroupObjectSimple,
  updateCoreObject,
  updateCosmeticsObject,
  updateAccessoriesObject,
  updateDisplayObject,
  updateFunctionalMajorObject,
  updateFunctionalMinorObject,
  updateWarrantyObject,
  resetState,
} = qnaSlice.actions;

export default qnaSlice.reducer;
