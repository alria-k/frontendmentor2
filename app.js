async function gatDashboardData(url = "./data.json") {
  const response = await fetch(url),
    data = await response.json();

  return data;
}

class DashBoardElement {
  static PERIODS = {
    daily: "day",
    weekly: "week",
    monthly: "month",
  };

  constructor(data, container = ".cards__box", view = "weekly") {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;

    this._createMarkup();
  }

  _createMarkup() {
    const { title, timeframes } = this.data;

    const id = title.toLowerCase().replace(/ /g, "-");
    const { current, previous } = timeframes[this.view.toLocaleLowerCase()];

    this.container.insertAdjacentHTML("beforeend", `
        <div class="cards__box__activites cards__box__activites-${id}">
        <article class="activites-card">
          <header class="activites-header">
            <h4 class="activites-header-title">${title}</h4>
            <svg width="21" height="5" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
                fill="#BBC0FF"
                fill-rule="evenodd"
              />
            </svg>
          </header>
          <div class="activites-body">
            <div class="activites-body__time">${current}hrs</div>
            <div class="activites-body__total">Last ${
              DashBoardElement.PERIODS[this.view]
            } - ${previous}hrs</div>
          </div>
        </article>
      </div>`);

      this.time = this.container.querySelector(`.cards__box__activites-${id} .activites-body__time`);
      this.prev = this.container.querySelector(`.cards__box__activites-${id} .activites-body__total`);
  }

  changeView(view) {
    this.view = view.toLowerCase();
    const { current, previous } = this.data.timeframes[this.view.toLocaleLowerCase()];
    this.time.innerText = `${current}hrs`;
    this.prev.innerText = `Last ${DashBoardElement.PERIODS[this.view]} - ${previous}hrs`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  gatDashboardData().then((data) => {
    const activites = data.map((activity) => new DashBoardElement(activity));

    const selectors = document.querySelectorAll(".cards__box-selectors-btns");
    selectors.forEach((selector) => {
      selector.addEventListener("click", () => {
        selectors.forEach((sel) =>
          sel.classList.remove("cards__box-selectors-btns--active")
        );
        selector.classList.add("cards__box-selectors-btns--active");
        const currentView = selector.innerText.trim().toLowerCase();
        activites.forEach((activity) => activity.changeView(currentView));
      });
    });
  });
});
