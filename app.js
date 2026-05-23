const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

function sendAction(action) {
  tg.sendData(JSON.stringify({ action: action }));

  setTimeout(() => {
    tg.close();
  }, 300);
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    sendAction(button.dataset.action);
  });
});
