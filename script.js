const progressBar = document.querySelector("[data-progress]");
const passwordInput = document.querySelector("[data-password-input]");
const passwordComponentsList = document.querySelector(
  "[data-password-components-list]"
);

const passwordComponents = new Map([
  [
    "min length 8",
    {
      regex: /^\S{8,}$/,
      satisfied: false,
      message: "Password must be at least 8 non-whitespace characters.",
    },
  ],
  [
    "can be longer",
    {
      regex: /^\S{15,}$/,
      satisfied: false,
      message: "Password can be longer.",
    },
  ],
  [
    "uppercase",
    {
      regex: /[A-Z]/,
      satisfied: false,
      message: "Password must contain at least 1 uppercase letter.",
    },
  ],
  [
    "lowercase",
    {
      regex: /[a-z]/,
      satisfied: false,
      message: "Password must contain at least 1 lowercase letter.",
    },
  ],
  [
    "number",
    {
      regex: /[0-9]/,
      satisfied: false,
      message: "Password must contain at least a digit.",
    },
  ],
  [
    "special character",
    {
      regex: /[~!@#$%^&*()_\-+={}|.,/:;"'\\`]/,
      satisfied: false,
      message: "Password must contain at least 1 special character.",
    },
  ],
  [
    "repeating characters",
    {
      regex: /(.)\1/,
      satisfied: false,
      message: "Password must not contain repeating characters.",
    },
  ],
  [
    "password",
    {
      regex: /password/i,
      satisfied: false,
      message: "Password must not contain password.",
    },
  ],
]);

passwordInput.addEventListener("input", (e) => {
  progressBar.value = checkPasswordStrength(e.target.value);

  updateComponentsList();
});

function checkPasswordStrength(value) {
  let componentsSize = passwordComponents.size;
  let fulfilledComponentsCount = 0;

  const repeating = passwordComponents.get("repeating characters");
  const password = passwordComponents.get("password");

  passwordComponents.forEach((com) => {
    if (com === password) {
      if (com.regex.test(value)) com.satisfied = false;
      else {
        com.satisfied = true;
        fulfilledComponentsCount++;
      }
    } else if (com === repeating) {
      if (com.regex.test(value)) com.satisfied = false;
      else {
        com.satisfied = true;
        fulfilledComponentsCount++;
      }
    } else {
      if (com.regex.test(value)) {
        com.satisfied = true;
        fulfilledComponentsCount++;
      } else {
        com.satisfied = false;
      }
    }
  });

  if (!value || value?.trim() === "") return 0;

  // what percent of components are fullfilled
  return (fulfilledComponentsCount / componentsSize) * 100;
}

function updateComponentsList() {
  passwordComponentsList.innerHTML = "";
  const fragmentElement = document.createDocumentFragment();

  passwordComponents.forEach((com) => {
    if (!com.satisfied) {
      const li = document.createElement("li");
      li.classList.add("list-item");
      li.textContent = com.message;

      fragmentElement.append(li);
    }
  });

  passwordComponentsList.append(fragmentElement);
}
