const form = document.querySelector("#diagnosticForm");
const steps = Array.from(document.querySelectorAll(".step"));
const nextButtons = document.querySelectorAll("[data-next]");
const prevButtons = document.querySelectorAll("[data-prev]");
const progressFill = document.querySelector("#progressFill");
const progressPercent = document.querySelector("#progressPercent");
const stepLabel = document.querySelector("#stepLabel");
const formDevice = document.querySelector("#formDevice");

const whatsappNumber = "5524992222862";

let currentStep = 0;
let isAnimating = false;

const stepNames = [
  "Início",
  "Nome",
  "Instagram",
  "Oferta",
  "Dificuldade",
  "Vendas",
  "Objetivo",
  "Tempo",
  "Resultado",
  "Final"
];

function updateProgress() {
  const max = steps.length - 1;
  const progress = Math.round((currentStep / max) * 100);

  progressFill.style.width = `${progress}%`;
  progressPercent.textContent = `${progress}%`;
  stepLabel.textContent = stepNames[currentStep] || "Diagnóstico";
}

function goToStep(nextStep, direction = "next") {
  if (
    isAnimating ||
    nextStep < 0 ||
    nextStep >= steps.length ||
    nextStep === currentStep
  ) {
    return;
  }

  isAnimating = true;

  const oldStep = steps[currentStep];
  const newStep = steps[nextStep];

  oldStep.classList.remove("active");

  if (direction === "next") {
    oldStep.classList.add("exit-left");
  }

  currentStep = nextStep;
  newStep.classList.remove("exit-left");

  requestAnimationFrame(() => {
    newStep.classList.add("active");
    updateProgress();
    premiumPulse();
  });

  setTimeout(() => {
    steps.forEach((step, index) => {
      if (index !== currentStep) {
        step.classList.remove("exit-left");
      }
    });

    isAnimating = false;
  }, 620);
}

function premiumPulse() {
  if (!formDevice) return;

  formDevice.style.transform = "translateY(-3px) scale(1.006)";

  setTimeout(() => {
    formDevice.style.transform = "";
  }, 320);
}

function getRequiredFieldsFromCurrentStep() {
  return Array.from(steps[currentStep].querySelectorAll("[required]"));
}

function validateCurrentStep() {
  const requiredFields = getRequiredFieldsFromCurrentStep();

  for (const field of requiredFields) {
    if (!field.value.trim()) {
      const card = steps[currentStep].querySelector(".card");

      if (card) {
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
      }

      if (field.type !== "hidden") {
        field.focus();
      }

      return false;
    }
  }

  return true;
}

nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!validateCurrentStep()) return;
    goToStep(currentStep + 1, "next");
  });
});

prevButtons.forEach((button) => {
  button.addEventListener("click", () => {
    goToStep(currentStep - 1, "prev");
  });
});

document.querySelectorAll(".option-list").forEach((list) => {
  const targetName = list.dataset.name;
  const hiddenInput = document.querySelector(`#${targetName}`);
  const options = Array.from(list.querySelectorAll(".option-card"));

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((item) => item.classList.remove("selected"));
      option.classList.add("selected");

      if (hiddenInput) {
        hiddenInput.value = option.dataset.value;
      }

      setTimeout(() => {
        goToStep(currentStep + 1, "next");
      }, 260);
    });
  });
});

function normalizeInstagram(value) {
  const clean = value.trim();

  if (!clean) return "";
  if (clean.startsWith("@")) return clean;

  return `@${clean}`;
}

function buildWhatsAppMessage() {
  const data = new FormData(form);

  const nome = data.get("nome") || "";
  const instagram = normalizeInstagram(data.get("instagram") || "");
  const produto = data.get("produto") || "";
  const dificuldade = data.get("dificuldade") || "";
  const vendas = data.get("vendas") || "";
  const objetivoPrincipal = data.get("objetivoPrincipal") || "";
  const tempo = data.get("tempo") || "";
  const objetivoFinal = data.get("objetivoFinal") || "";

  const rawMessage =
`*Diagnóstico Estratégico — Mentoria de Conteúdo*

*Nome:*
${nome}

*Instagram:*
${instagram}

*O que vende hoje:*
${produto}

*Maior dificuldade:*
${dificuldade}

*Já vende pelo Instagram:*
${vendas}

*Quer melhorar:*
${objetivoPrincipal}

*Tempo disponível:*
${tempo}

*Objetivo final:*
${objetivoFinal}`;

  return encodeURIComponent(rawMessage);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`;
  window.open(whatsappUrl, "_blank");
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const activeElement = document.activeElement;
    const isTextarea = activeElement && activeElement.tagName === "TEXTAREA";

    if (!isTextarea && currentStep > 0 && currentStep < steps.length - 1) {
      event.preventDefault();

      if (!validateCurrentStep()) return;

      goToStep(currentStep + 1, "next");
    }
  }

  if (event.key === "ArrowLeft") {
    goToStep(currentStep - 1, "prev");
  }

  if (event.key === "ArrowRight") {
    if (!validateCurrentStep()) return;
    goToStep(currentStep + 1, "next");
  }
});

const canHover = window.matchMedia("(hover: hover)").matches;

if (canHover && formDevice) {
  window.addEventListener("mousemove", (event) => {
    const rect = formDevice.getBoundingClientRect();
    const deviceCenterX = rect.left + rect.width / 2;
    const deviceCenterY = rect.top + rect.height / 2;

    const distanceX = (event.clientX - deviceCenterX) / rect.width;
    const distanceY = (event.clientY - deviceCenterY) / rect.height;

    const rotateY = Math.max(Math.min(distanceX * 7, 7), -7);
    const rotateX = Math.max(Math.min(distanceY * -7, 7), -7);

    formDevice.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  window.addEventListener("mouseleave", () => {
    formDevice.style.transform =
      "perspective(1100px) rotateX(0deg) rotateY(0deg)";
  });
}

document.querySelectorAll(".magnetic").forEach((button) => {
  if (!canHover) return;

  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.08}px, ${y * 0.15}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

updateProgress();
