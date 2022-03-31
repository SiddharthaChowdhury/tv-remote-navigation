export const animateFocus = (itemId: string) => {
  const target = document.getElementById(itemId);
  const current = document.getElementsByClassName("focused");

  if (!target) {
    console.warn("Target focus node not available");
  }

  if (current[0]) {
    current[0].classList.remove("focused");
  }

  if (target && target.dataset.type === "item") {
    target.classList.add("focused");
  }
};
