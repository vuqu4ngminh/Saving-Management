const formatDay = (timestamp) => {
  let date = new Date(timestamp);
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let day = date.getDate();
  return day + "-" + month + "-" + year;
};

// return terms
const checkTerm = (term) => {
  let value;
  switch (term) {
    case "m1":
      value = "1 tháng";
      break;
    case "m3":
      value = "3 tháng";
      break;
    case "m6":
      value = "6 tháng";
      break;
    case "m12":
      value = "12 tháng";
      break;
    case "m18":
      value = "18 tháng";
      break;
    case "m24":
      value = "24 tháng";
      break;
    case "m36":
      value = "36 tháng";
      break;
    default:
      break;
  }

  return value;
};

// check number (return true or false)
const checkIsNumber = (text) => {
  try {
    let value = Number(text);
    return Number.isFinite(value);
  } catch (error) {
    return false;
  }
};

// format currency string to xxx.xxx
const formatCurrency = (amount) => {
  return amount.toLocaleString();
};

// change vietnamese accents to normal string
const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase();
};

// count days
const countDays = (openDate, endDate) => {
  let od = new Date(openDate);
  let ed = new Date(endDate);

  return (ed - od) / 1000 / 60 / 60 / 24;
};
module.exports = {
  formatDay,
  checkTerm,
  checkIsNumber,
  formatCurrency,
  removeAccents,
  countDays
};
