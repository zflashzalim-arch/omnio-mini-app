const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();

  const user = tg.initDataUnsafe?.user;
  const helloText = document.getElementById("helloText");

  if (user?.first_name) {
    helloText.textContent = `${user.first_name}, добро пожаловать в OMNIO`;
  }
}

const actionLabels = {
  food: "🍽 Питание",
  water: "💧 Вода",
  sleep: "😴 Сон",
  labs: "📋 Анализы",
  mood: "😊 Настроение",
  summary: "📊 Мой день",
  profile: "⚙️ Профиль"
};

function sendAction(action) {
  if (!tg) {
    alert(`Открыть раздел: ${actionLabels[action] || action}`);
    return;
  }

  tg.sendData(JSON.stringify({ action }));

  tg.HapticFeedback?.impactOccurred("light");

  setTimeout(() => {
    tg.close();
  }, 250);
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    sendAction(button.dataset.action);
  });
});
