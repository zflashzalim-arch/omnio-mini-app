const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();

  const user = tg.initDataUnsafe?.user;
  if (user?.first_name) {
    document.getElementById("hello").textContent = `${user.first_name}, добро пожаловать в OMNIO`;
  }
}

const actions = {
  food: "Открыть раздел: Фото еды",
  water: "Открыть раздел: Вода",
  sleep: "Открыть раздел: Сон",
  labs: "Открыть раздел: Анализы",
  mood: "Открыть раздел: Настроение",
  report: "Открыть раздел: Дневной отчёт",
};

document.querySelectorAll(".card").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    tg?.showAlert(actions[action] || "Раздел OMNIO");
  });
});

document.getElementById("sendToBot").addEventListener("click", () => {
  const payload = {
    type: "mini_app_event",
    message: "Пользователь открыл Mini App OMNIO",
    date: new Date().toISOString(),
  };

  if (tg) {
    tg.sendData(JSON.stringify(payload));
    tg.close();
  } else {
    alert("Mini App работает внутри Telegram");
  }
});
