import "./styles.css";
import * as PIXI from "pixi.js";
import {
  boxCostsList,
  topBounce,
  initialLevel,
  sideBounce,
  boxColors,
} from "./variables";
import { Peg, Play, Box } from "./Classes";
import { checkPositiveInputValue } from "./helperFunctions";
import { AutoPlayOptionKeys } from "./types";

let fraction: number;
let boxes: Box[] = [];
let selectedLevel: number = initialLevel;
let pegs: Peg[] = [];
let bet: number = 1;

const currentGame: {
  gamesActive: number;
  currentAmount: number;
} = {
  gamesActive: 0,
  currentAmount: 100,
};

const autoPlayOptions: {
  selectedColors: string[];
  roundNumber: number;
  stopIfCashDecreases: {
    active: boolean;
    value: number;
  };
  stopIfWinExceeds: {
    active: boolean;
    value: number;
  };
  stopIfCashIncreased: {
    active: boolean;
    value: number;
  };
  ifLostIncrease: {
    active: boolean;
    value: number;
  };
  ifLostDecrease: {
    active: boolean;
    value: number;
  };
  ifWonIncrease: {
    active: boolean;
    value: number;
  };
  ifWonDecrease: {
    active: boolean;
    value: number;
  };
} = {
  selectedColors: ["green", "orange", "red"],
  roundNumber: 3,
  stopIfCashDecreases: {
    active: false,
    value: 0,
  },
  stopIfWinExceeds: {
    active: false,
    value: 0,
  },
  stopIfCashIncreased: {
    active: false,
    value: 0,
  },
  ifLostIncrease: {
    active: false,
    value: 0,
  },
  ifLostDecrease: {
    active: false,
    value: 0,
  },
  ifWonIncrease: {
    active: false,
    value: 0,
  },
  ifWonDecrease: {
    active: false,
    value: 0,
  },
};

const startPlaying = (
  balanceAmount: HTMLElement,
  betInput: HTMLInputElement,
  selectedColor: string,
  lineOptions: Element[],
  app: PIXI.Application<PIXI.Renderer>,
  autoPlayButton: HTMLElement,
  playButtonsContainer?: HTMLElement,
  BetAmountContainer?: HTMLElement
) => {
  if (isNaN(bet)) {
    bet = 0.1;
  }
  if (currentGame.currentAmount > 0 && bet <= currentGame.currentAmount) {
    if (betInput.value < "0.1" || isNaN(parseFloat(betInput.value))) {
      bet = 0.1;
      betInput.value = "0.1";
    }
    currentGame.currentAmount -= bet;
    balanceAmount.innerHTML = currentGame.currentAmount.toFixed(2);

    new Play(
      app,
      fraction,
      pegs,
      boxes,
      selectedColor,
      bet,
      topBounce,
      sideBounce,
      currentGame,
      lineOptions,
      autoPlayButton,
      playButtonsContainer,
      BetAmountContainer
    ).start();
  }
};

const setup = (levels: number, app: PIXI.Application<PIXI.Renderer>): void => {
  const lines: number = 2 + levels;

  const boxCosts: { [key: string]: number[] } = boxCostsList[selectedLevel];

  pegs = [];
  boxes = [];

  fraction = 5 / lines;

  let spaceBottom: number = 150 * fraction;

  for (let i = 3; i <= lines; i++) {
    let spaceLeft: number = 50;

    for (let space = 1; space <= lines - i; space++) {
      spaceLeft += 70 * fraction;
    }

    for (let point = 1; point <= i; point++) {
      const pegObj = new Peg(
        spaceLeft,
        spaceBottom,
        1 * fraction,
        1 * fraction,
        (30 * fraction) / 2
      );
      const newPeg = pegObj.create();

      app.stage.addChild(newPeg);

      pegs.push(pegObj);
      spaceLeft += 150 * fraction;
    }

    spaceBottom += 90 * fraction;
  }

  let colorIndex: number = 0;

  for (let color in boxCosts) {
    const currentboxes: number[] = boxCosts[color];
    for (let s = 0; s < currentboxes.length; s++) {
      const tempBottomPeg = pegs[pegs.length - 1 - currentboxes.length + s];
      const boxObj = new Box(
        tempBottomPeg.x + tempBottomPeg.width * fraction,
        spaceBottom + 40 * colorIndex,
        680 / lines,
        36,
        currentboxes[s],
        boxColors[colorIndex],
        selectedLevel
      );

      const newBox = boxObj.create();

      app.stage.addChild(newBox);

      boxes.push(boxObj);
    }
    colorIndex++;
  }
};

window.onload = async () => {
  const balanceAmount = document.querySelector(
    "#balance-amount"
  ) as HTMLElement;
  const autoPlayButton = document.querySelector(
    ".auto-play-button"
  ) as HTMLElement;
  const autoPlayButtonCount = document.querySelector(
    ".auto-play-button--count"
  ) as HTMLDivElement;
  const autoPlaySettingsContainer = document.querySelector(
    ".auto-play__settings_container"
  ) as HTMLDivElement;
  const closeIcon = document.querySelector(
    "#auto-play__settings-close-icon"
  ) as HTMLImageElement;
  const betInput = document.querySelector(
    "#bet-amount-input"
  ) as HTMLInputElement;
  const canvasElement = document.querySelector(".canvas") as HTMLDivElement;
  const playButtonsContainer = document.querySelector(
    ".play-buttons_container"
  ) as HTMLElement;
  const BetAmountContainer = document.querySelector(
    ".bet-amount-options_container"
  ) as HTMLElement;
  const lineOptions = Array.from(
    window.document.querySelectorAll<Element>(".line-option")
  );
  const colorItems = document.querySelectorAll<HTMLElement>(
    ".auto-play__settings-bet-color-item_container"
  );
  const playButtons = document.querySelectorAll<HTMLElement>(".play-button");
  const roundNumberItems = document.querySelectorAll<HTMLElement>(
    ".auto-play__settings-round-number-item_container"
  );
  const numberInputContainers = document.querySelectorAll<HTMLElement>(
    ".number-input-container"
  );
  const switchItemContainers = document.querySelectorAll<HTMLElement>(
    ".auto-play__settings-switch-item_container"
  );
  const moreOptionsButton = document.querySelector(
    ".auto-play__settings-more-options-button"
  ) as HTMLElement;
  const moreOptionsContainer = document.querySelector(
    ".auto-play__settings-more-options_container"
  ) as HTMLElement;
  const conditionalBetContainers = document.querySelectorAll<HTMLElement>(
    ".auto-play__settings-more-options-conditional-bet-item_container"
  );
  const autoPlaySettingsStartButton = document.querySelector(
    ".auto-play__settings-play_button"
  ) as HTMLElement;

  let app = new PIXI.Application();

  await app.init({ width: 800, height: 600, backgroundColor: "skyblue" });

  app.stage.eventMode = "auto";
  canvasElement!.appendChild(app.canvas);

  const destroyApp = async (): Promise<void> => {
    canvasElement!.removeChild(app.canvas);

    app = new PIXI.Application();

    await app.init({ width: 800, height: 600, backgroundColor: "skyblue" });

    canvasElement!.appendChild(app.canvas);
  };

  setup(initialLevel, app);

  canvasElement!.appendChild(app.canvas);

  lineOptions.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const target = e.target as HTMLElement;
      if (currentGame.gamesActive > 0 || target.id) {
        return;
      }

      const newLevel: number = Number(target.innerHTML);
      selectedLevel = newLevel;
      await destroyApp();
      setup(newLevel, app);

      lineOptions.forEach((lineNumber) => {
        lineNumber.removeAttribute("id");
        if (newLevel === Number(lineNumber.innerHTML)) {
          lineNumber.id = "selected-line";
        }
      });
    });
  });

  balanceAmount.innerHTML = currentGame.currentAmount.toFixed(2);

  betInput.addEventListener("input", () => {
    const value = checkPositiveInputValue(
      betInput.value,
      0,
      currentGame.currentAmount
    );
    betInput.value = value;
    bet = parseFloat(value);
  });

  betInput.addEventListener("blur", () => {
    bet = parseFloat(betInput.value) || 0;
    if (bet <= 0) {
      bet = 0.1;
      betInput.value = bet.toFixed(2);
    }
  });

  document
    .querySelector("#bet-amount-button__increase")!
    .addEventListener("click", () => {
      if (1 + bet <= currentGame.currentAmount) {
        bet += 1;
        betInput.value = bet.toFixed(2);
      }
    });

  document
    .querySelector("#bet-amount-button__decrease")!
    .addEventListener("click", () => {
      if (bet - 1 >= 0) {
        bet -= 1;
        betInput.value = bet.toFixed(2);
      }
    });

  Array.from(playButtons).forEach((button) => {
    button.addEventListener("click", () => {
      const selectedColor: string = button.textContent!.trim().toLowerCase();
      startPlaying(
        balanceAmount,
        betInput,
        selectedColor,
        lineOptions,
        app,
        autoPlayButton
      );
    });
  });

  autoPlayButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (currentGame.gamesActive === 0)
      autoPlaySettingsContainer.classList.toggle("visible");
  });

  autoPlayButtonCount.addEventListener("click", (event) => {
    event.stopPropagation();
    autoPlayOptions.roundNumber = 0;
    autoPlayButtonCount.style.zIndex = "-1";
  });

  closeIcon.addEventListener("click", () => {
    autoPlaySettingsContainer.classList.remove("visible");
  });

  document.addEventListener("click", (event) => {
    const target = event.target as Node;
    if (
      !autoPlaySettingsContainer.contains(target) &&
      !autoPlayButton.contains(target)
    ) {
      autoPlaySettingsContainer.classList.remove("visible");
    }
  });

  colorItems.forEach((item) => {
    const checkbox = item.querySelector(
      "input[type='checkbox']"
    ) as HTMLInputElement;

    item.addEventListener("click", () => {
      const colorCircle = item.querySelector(
        ".auto-play__settings-bet-color-circle"
      ) as HTMLElement;
      const colorName = colorCircle.id.split("--")[1]?.toLowerCase();

      if (colorName) {
        const colorIndex = autoPlayOptions.selectedColors.indexOf(colorName);

        if (colorIndex === -1) {
          autoPlayOptions.selectedColors.push(colorName);

          checkbox.checked = true;
        } else {
          autoPlayOptions.selectedColors.splice(colorIndex, 1);
          if (checkbox) {
            checkbox.checked = false;
          }
        }
      }
    });
  });

  roundNumberItems.forEach((item) => {
    const checkbox = item.querySelector(
      "input[type='checkbox']"
    ) as HTMLInputElement;

    item.addEventListener("click", () => {
      roundNumberItems.forEach((innerItem) => {
        const innerCheckbox = innerItem.querySelector(
          "input[type='checkbox']"
        ) as HTMLInputElement;
        innerCheckbox.checked = false;
      });

      checkbox.checked = true;
      const roundNumberText = item.querySelector(
        ".auto-play__settings-item-info_container > div"
      ) as HTMLElement;
      autoPlayOptions.roundNumber = parseInt(roundNumberText.innerText, 10);
    });
  });

  Array.from(switchItemContainers).forEach((container) => {
    const checkbox = container.querySelector(
      "input[type='checkbox']"
    ) as HTMLInputElement;
    const numberInputContainer = container.querySelector(
      ".number-input-container"
    ) as HTMLElement;
    const switchContainer = container.querySelector(
      ".auto-play__settings-switch_container"
    ) as HTMLElement;
    const numberInput = container.querySelector(
      ".number-input"
    ) as HTMLInputElement;

    const inputId = numberInput.id as AutoPlayOptionKeys;

    switchContainer.addEventListener("click", () => {
      checkbox.checked = !checkbox.checked;
      autoPlayOptions[inputId].active = checkbox.checked;
      if (!checkbox.checked) {
        numberInputContainer.classList.add("faded-disabled");
      } else {
        numberInputContainer.classList.remove("faded-disabled");
      }
    });
  });

  Array.from(numberInputContainers).forEach((container) => {
    const numberInput = container.querySelector(
      ".number-input"
    ) as HTMLInputElement;

    const decreaseButton = container.querySelector(
      ".input-action-decrease"
    ) as HTMLElement;

    const increaseButton = container.querySelector(
      ".input-action-increase"
    ) as HTMLElement;

    const inputId = numberInput.id as AutoPlayOptionKeys;

    if (decreaseButton) {
      decreaseButton.addEventListener("click", () => {
        let parsedDecreaseByInputValue = Number.parseFloat(numberInput.value);
        if (parsedDecreaseByInputValue - 1 >= 0)
          autoPlayOptions[inputId].value -= 1;
        numberInput.value = autoPlayOptions[inputId].value.toFixed(2);
      });
    }

    if (increaseButton) {
      increaseButton.addEventListener("click", () => {
        let parsedDecreaseByInputValue = Number.parseFloat(numberInput.value);
        if (parsedDecreaseByInputValue + 1 <= currentGame.currentAmount)
          autoPlayOptions[inputId].value += 1;
        numberInput.value = autoPlayOptions[inputId].value.toFixed(2);
      });
    }

    numberInput.addEventListener("input", () => {
      const value = checkPositiveInputValue(
        numberInput.value,
        0,
        currentGame.currentAmount
      );
      autoPlayOptions[inputId].value = parseFloat(value);
      numberInput.value = value;
    });
  });

  moreOptionsButton.addEventListener("click", () => {
    const triangleIcon = moreOptionsButton.querySelector("img") as HTMLElement;
    triangleIcon.classList.toggle("flipped");
    moreOptionsContainer.classList.toggle("expanded");
  });

  conditionalBetContainers.forEach((container) => {
    const checkboxes = container.querySelectorAll<HTMLInputElement>(
      "input[type='checkbox']"
    );
    const itemContainers = container.querySelectorAll<HTMLElement>(
      ".auto-play__settings-item_container"
    );

    itemContainers.forEach((itemContainer) => {
      const checkbox = itemContainer.querySelector(
        "input[type='checkbox']"
      ) as HTMLInputElement;

      itemContainer.addEventListener("click", () => {
        if (checkbox.checked) {
          return;
        }

        const inputs =
          container.querySelectorAll<HTMLInputElement>(".number-input");
        inputs.forEach((otherInputs) => {
          const inputId = otherInputs.id as AutoPlayOptionKeys;
          autoPlayOptions[inputId].active = false;
        });

        const inputId = itemContainer.querySelector<HTMLInputElement>(
          ".number-input"
        )?.id as AutoPlayOptionKeys | undefined;

        if (inputId) {
          autoPlayOptions[inputId].active = true;
        }

        checkboxes.forEach((otherCheckbox) => {
          otherCheckbox.checked = false;
        });
        checkbox.checked = true;
        itemContainer.classList.remove("faded");

        itemContainers.forEach((container) => {
          const isChecked = container.querySelector<HTMLInputElement>(
            "input[type='checkbox']"
          )?.checked;
          container.classList.toggle("faded", !isChecked);
        });
      });
    });
  });

  autoPlaySettingsStartButton.addEventListener("click", async () => {
    playButtonsContainer.classList.add("faded-disabled");
    BetAmountContainer.classList.add("faded-disabled");
    autoPlaySettingsContainer.classList.remove("visible");
    autoPlayButtonCount.style.zIndex = "1";

    for (let i = 0; i < autoPlayOptions.roundNumber; i++) {
      const count = autoPlayOptions.roundNumber - i - 1;

      if (count <= 0) {
        autoPlayButtonCount.style.zIndex = "-1";
      }

      autoPlayButtonCount.textContent = count.toString();
      startPlaying(
        balanceAmount,
        betInput,
        autoPlayOptions.selectedColors[
          i % autoPlayOptions.selectedColors.length
        ],
        lineOptions,
        app,
        autoPlayButton,
        playButtonsContainer,
        BetAmountContainer
      );

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  });
};
