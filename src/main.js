import "./css/index.css";
import IMask from "imask";

/**
 * Section of card data
 */
const cardData = [];
console.log(cardData);

/**
 * Section of colors
 */
const ccBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);
const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    elo: ["#FFCC00", "#00A0DE"],
    maestro: ["#EB001B", "#00A2E5"],
    amex: ["#0077A6", "white"],
    default: ["black", "gray"],
  };
  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}
setCardType("default");

/**
 * Section of security code
 */
const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000",
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = code.length === 0 ? "123" : code;
}

/**
 * Expiration Section
 */
const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value);
});

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value");
  ccExpiration.innerText = date.length === 0 ? "02/32" : date;
}

/**
 * Card Number Section
 */
const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4[0-9]{15}$/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 000000 00000",
      regex: /^3[47][0-9]{13}$/,
      cardtype: "amex",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:
        /^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/,
      cardType: "elo",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const maskFounded = dynamicMasked.compiledMasks.find((item) => {
      return number.match(item.regex);
    });
    return maskFounded;
  },
};
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}

/**
 * Clear the inputs
 */
function clearCardData() {
  setCardType("default");
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText = "FULANO DA SILVA";

  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = "1234 5678 9012 3456";

  const ccExpiration = document.querySelector(".cc-expiration .value");
  ccExpiration.innerText = "02/32";

  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = "123";
}

/**
 * Push data to array
 */
function sendDataToCardData() {
  cardData.push({
    cardNumber: cardNumberMasked.value,
    cardHolder: cardHolder.value.toUpperCase(),
    expirationDate: expirationDateMasked.value,
    verificationCode: securityCodeMasked.value,
    cardType: cardNumberMasked.masked.currentMask.cardType,
  });
}

/**
 * Submit Section
 */
const formSubmit = document.querySelector("form");
formSubmit.addEventListener("submit", (event) => {
  event.preventDefault();
  if ((cardNumberMasked.value.length && expirationDateMasked.value.length && securityCodeMasked.value.length) === 0) {
    alert("Nenhum dado enviado!");
    return;
  } else {
    alert("Cartão adicionado!");
    sendDataToCardData();
    clearCardData();
    formSubmit.reset();
  }
});

/**
 * Card Holder section
 */
const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;
});
