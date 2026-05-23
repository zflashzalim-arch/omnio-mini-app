const tg = window.Telegram?.WebApp;

const state = {
  water: Number(localStorage.getItem("omnio_water") || 0),
  sleepHours: localStorage.getItem("omnio_sleep_hours") || "",
  sleepQuality: localStorage.getItem("omnio_sleep_quality") || "",
  mood: localStorage.getItem("omnio_mood") || "",
};

if (tg) {
  tg.ready();
  tg.expand();

  const user = tg.initDataUnsafe?.user;
  if (user?.first_name) {
    document.getElementById("hello").textContent = `${user.first_name}, добро пожаловать в OMNIO`;
  }
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
  updateUi();
}

function updateUi() {
  document.getElementById("waterAmount").textContent = state.water;
  document.getElementById("waterToday").textContent = `${state.water} мл`;
  document.getElementById("reportWater").textContent = `${state.water} мл`;

  const sleepText = state.sleepHours ? `${state.sleepHours} ч, ${state.sleepQuality}` : "не записан";
  document.getElementById("sleepToday").textContent = sleepText;
  document.getElementById("reportSleep").textContent = sleepText;

  const moodText = state.mood || "не записано";
  document.getElementById("moodToday").textContent = moodText;
  document.getElementById("reportMood").textContent = moodText;
}

function sendToBot(action, extra = {}) {
  const payload = {
    type: "mini_app_action",
    action,
    water: state.water,
    sleepHours: state.sleepHours,
    sleepQuality: state.sleepQuality,
    mood: state.mood,
    ...extra,
    date: new Date().toISOString(),
  };

  if (tg) {
    tg.sendData(JSON.stringify(payload));
    tg.HapticFeedback?.impactOccurred("light");
    setTimeout(() => tg.close(), 250);
  } else {
    alert(JSON.stringify(payload, null, 2));
  }
}

document.querySelectorAll("[data-screen]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

document.querySelectorAll(".back").forEach((button) => {
  button.addEventListener("click", () => showScreen("homeScreen"));
});

document.querySelectorAll("[data-water]").forEach((button) => {
  button.addEventListener("click", () => {
    state.water += Number(button.dataset.water);
    localStorage.setItem("omnio_water", state.water);
    updateUi();
  });
});

document.querySelector("[data-send='sleep']").addEventListener("click", () => {
  const hours = document.getElementById("sleepHours").value;
  const quality = document.getElementById("sleepQuality").value;

  if (!hours) {
    tg?.showAlert("Укажи часы сна");
    return;
  }

  state.sleepHours = hours;
  state.sleepQuality = quality;
  localStorage.setItem("omnio_sleep_hours", hours);
  localStorage.setItem("omnio_sleep_quality", quality);
  updateUi();

  sendToBot("sleep", { hours, quality });
});

document.querySelector("[data-send='mood']").addEventListener("click", () => {
  const moodSelect = document.getElementById("moodValue");
  const stress = document.getElementById("stressValue").value;
  const energy = document.getElementById("energyValue").value;
  const moodLabel = moodSelect.options[moodSelect.selectedIndex].text;

  state.mood = moodLabel;
  localStorage.setItem("omnio_mood", moodLabel);
  updateUi();

  sendToBot("mood", {
    mood: moodSelect.value,
    moodLabel,
    stress,
    energy,
  });
});

document.querySelectorAll("[data-send]").forEach((button) => {
  const action = button.dataset.send;
  if (action === "sleep" || action === "mood") return;

  button.addEventListener("click", () => {
    sendToBot(action);
  });
});

updateUi();
