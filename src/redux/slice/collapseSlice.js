import { createSlice } from "@reduxjs/toolkit";
const initialValue =
  localStorage.getItem("newssystem-collapse") === 'true'
    ? true
    : false;
console.log(initialValue);
export const collapseSlice = createSlice({
  name: "collapse",
  initialState: {
    value: initialValue,
  },
  reducers: {
    toggleCollapse: (state) => {
      // Redux Toolkit 允许我们在 reducers 中编写 mutating 逻辑。
      // 它实际上并没有 mutate state 因为它使用了 Immer 库，
      // 它检测到草稿 state 的变化并产生一个全新的基于这些更改的不可变 state
      state.value = !state.value;
      localStorage.setItem("newssystem-collapse", state.value);
    },
  },
});

export const { toggleCollapse } = collapseSlice.actions;

export default collapseSlice.reducer;
