const form = document.querySelector("#diagnosticForm");
const steps = Array.from(document.querySelectorAll(".step"));
const nextButtons = document.querySelectorAll("[data-next]");
const prevButtons = document.querySelectorAll("[data-prev]");
const progressFill = document.querySelector("#progressFill");
const progressPercent = document.querySelector("#progressPercent");
const stepLabel = document.querySelector("#stepLabel");
const phoneStage = document.querySelector("#phoneStage");

const whatsappNumber = "5524992222862";

let currentStep = 0;

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

function updateStep(newStep, direction = "next") {
  const oldStep = currentStep;

  steps[oldStep].classList.remove("active");
  if (direction === "next") {
    steps[oldStep].classList.add("leaving-left");
  }

  currentStep = newStep;

  steps[currentStep].classList.remove("leaving-left");

  setTimeout(() => {
    steps.forEach((step, index) => {
      if (index !== currentStep) {
        step.classList.remove("leaving-left");
      }
    });
  }, 450);

  steps[currentStep].classList.add("active");
  updateProgress();
  triggerParallax();
}

function updateProgress() {
  const totalQuestions = steps.length - 1;
  const progress = Math.round((currentStep / totalQuestions) * 100);

  progressFill.style.width = `${progress}%`;
  progressPercent.textContent = `${progress}%`;
  stepLabel.textContent = stepNames[currentStep] || "Diagnóstico";
}

function triggerParallax() {
  phoneStage.classList.add("parallax-pop");

  setTimeout(() => {
    phoneStage.classList.remove("parallax-pop");
  }, 520);
}

function validateCurrentStep() {
  const current = steps[currentStep];
  const requiredFields = Array.from(current.querySelectorAll("[required]"));

  for (const field of requiredFields) {
    if (!field.value.trim()) {
      const card = current.querySelector(".glass-card");
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");

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

    if (currentStep < steps.length - 1) {
      updateStep(currentStep + 1, "next");
    }
  });
});

prevButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentStep > 0) {
      updateStep(currentStep - 1, "prev");
    }
  });
});

document.querySelectorAll(".option-list").forEach((list) => {
  const targetName = list.dataset.name;
  const hiddenInput = document.querySelector(`#${targetName}`);
  const options = list.querySelectorAll(".option-card");

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((item) => item.classList.remove("selected"));
      option.classList.add("selected");
      hiddenInput.value = option.dataset.value;

      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          updateStep(currentStep + 1, "next");
        }
      }, 240);
    });
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);

  const nome = data.get("nome") || "";
  const instagram = data.get("instagram") || "";
  const produto = data.get("produto") || "";
  const dificuldade = data.get("dificuldade") || "";
  const vendas = data.get("vendas") || "";
  const objetivoPrincipal = data.get("objetivoPrincipal") || "";
  const tempo = data.get("tempo") || "";
  const objetivoFinal = data.get("objetivoFinal") || "";

  const message =
    `*Diagnóstico Estratégico — Mentoria de Conteúdo*%0A%0A` +
    `*Nome:*%0A${encodeURIComponent(nome)}%0A%0A` +
    `*Instagram:*%0A${encodeURIComponent(instagram)}%0A%0A` +
    `*O que vende hoje:*%0A${encodeURIComponent(produto)}%0A%0A` +
    `*Maior dificuldade:*%0A${encodeURIComponent(dificuldade)}%0A%0A` +
    `*Já vende pelo Instagram:*%0A${encodeURIComponent(vendas)}%0A%0A` +
    `*Quer melhorar:*%0A${encodeURIComponent(objetivoPrincipal)}%0A%0A` +
    `*Tempo disponível:*%0A${encodeURIComponent(tempo)}%0A%0A` +
    `*Objetivo final:*%0A${encodeURIComponent(objetivoFinal)}`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(whatsappUrl, "_blank");
});

window.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 10;
  const y = (event.clientY / window.innerHeight - 0.5) * -10;

  phoneStage.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

window.addEventListener("mouseleave", () => {
  phoneStage.style.transform = "rotateY(0deg) rotateX(0deg)";
});

updateProgress();
