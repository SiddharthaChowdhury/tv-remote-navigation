export const setFocus = (itemId: string) => {
  const target = document.getElementById(itemId);
  const current = document.getElementsByClassName("focused");

  if (current[0]) {
    current[0].classList.remove("focused");
  }

  if (target && target.dataset.type === "item") {
    target.classList.add("focused");
  }
};
