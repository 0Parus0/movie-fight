import { debounce } from "./utils.js";
export default function createAutoComplete({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) {
  root.innerHTML = `
  <label htmlFor="">Search</label>
  <input type="text" name="input" id="input" class="input" />
  <div class="dropdown">
  <div class="dropdown-menu">
  <div class="dropdown-content results"></div>
  </div>
  </div>
`;

  const input = root.querySelector("#input");
  const dropdown = root.querySelector(".dropdown");
  const resultWrapper = root.querySelector(".results");
  const onInput = async (e) => {
    const items = await fetchData(e.target.value);
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    resultWrapper.innerHTML = "";
    dropdown.classList.add("is-active");
    for (let item of items) {
      const option = document.createElement("a");
      option.addEventListener("click", (e) => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });
      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      resultWrapper.appendChild(option);
    }
  };

  input.addEventListener("input", debounce(onInput, 2000));
  document.addEventListener("click", function (e) {
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
}
