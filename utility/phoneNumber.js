const COUNTRY_CODE = "61";

const MOBILE_PREFIX = "4";
const LANDLINE_PREFIXES = new Set(["2", "3", "7", "8"]);
const SPECIAL_SERVICE_PREFIXES = ["1300", "1800", "1900", "13"];

export const AU_PHONE_ERROR = {
  EMPTY: "EMPTY",
  NO_DIGITS: "NO_DIGITS",
  INVALID_COUNTRY_CODE: "INVALID_COUNTRY_CODE",
  INVALID_LENGTH: "INVALID_LENGTH",
  INVALID_PREFIX: "INVALID_PREFIX",
};

const sanitizeInput = (value = "") => {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }
  return String(value)
    .replace(/\u00A0/g, " ")
    .trim();
};

const stripFormatting = (value) => {
  const normalized = sanitizeInput(value);
  const hasPlus = normalized.startsWith("+");
  const digits = normalized.replace(/\D/g, "");
  return { digits, hasPlus };
};

const buildE164 = (national) => {
  if (!national) {
    return null;
  }
  const significant = national.startsWith("0") ? national.slice(1) : national;
  return `+${COUNTRY_CODE}${significant}`;
};

const looksLikeSpecialService = (number) => {
  return SPECIAL_SERVICE_PREFIXES.some((prefix) => number.startsWith(prefix));
};

const clampDigits = (value, targetLength) => {
  if (!value) {
    return value;
  }
  return value.length > targetLength ? value.slice(0, targetLength) : value;
};

const convertInternationalSubscriber = (subscriber) => {
  if (!subscriber) {
    return { error: AU_PHONE_ERROR.INVALID_LENGTH };
  }

  if (looksLikeSpecialService(subscriber)) {
    return {
      national: clampDigits(subscriber, subscriber.startsWith("13") ? 6 : 10),
    };
  }

  if (subscriber.startsWith("0")) {
    const national = clampDigits(subscriber, 10);
    if (national.length !== 10) {
      return { error: AU_PHONE_ERROR.INVALID_LENGTH };
    }
    return { national };
  }

  if (subscriber.length < 9) {
    return { error: AU_PHONE_ERROR.INVALID_LENGTH };
  }

  const national = `0${clampDigits(subscriber, 9)}`;
  return { national };
};

const convertToNational = ({ digits, hasPlus }) => {
  if (!digits) {
    return { error: AU_PHONE_ERROR.NO_DIGITS };
  }

  if (hasPlus) {
    if (!digits.startsWith(COUNTRY_CODE)) {
      return { error: AU_PHONE_ERROR.INVALID_COUNTRY_CODE };
    }
    const subscriber = digits.slice(COUNTRY_CODE.length);
    return convertInternationalSubscriber(subscriber);
  }

  if (digits.startsWith(COUNTRY_CODE)) {
    const subscriber = digits.slice(COUNTRY_CODE.length);
    return convertInternationalSubscriber(subscriber);
  }

  if (digits.length >= 10 && digits.startsWith("0")) {
    return { national: clampDigits(digits, 10) };
  }

  if (digits.length >= 9 && LANDLINE_PREFIXES.has(digits[0])) {
    return { national: `0${clampDigits(digits, 9)}` };
  }

  if (looksLikeSpecialService(digits)) {
    return {
      national: clampDigits(digits, digits.startsWith("13") ? 6 : 10),
    };
  }

  return { error: AU_PHONE_ERROR.INVALID_LENGTH };
};

const validateNationalNumber = (national) => {
  if (!national) {
    return { valid: false, error: AU_PHONE_ERROR.INVALID_LENGTH };
  }

  if (looksLikeSpecialService(national)) {
    if (national.startsWith("13") && national.length !== 6 && national.length !== 10) {
      return { valid: false, error: AU_PHONE_ERROR.INVALID_LENGTH };
    }
    if ((national.startsWith("1300") || national.startsWith("1800") || national.startsWith("1900")) && national.length !== 10) {
      return { valid: false, error: AU_PHONE_ERROR.INVALID_LENGTH };
    }
    return { valid: true, type: "special" };
  }

  if (!national.startsWith("0") || national.length !== 10) {
    return { valid: false, error: AU_PHONE_ERROR.INVALID_LENGTH };
  }

  const typeDigit = national[1];
  if (typeDigit === MOBILE_PREFIX) {
    return { valid: true, type: "mobile" };
  }

  if (LANDLINE_PREFIXES.has(typeDigit)) {
    return { valid: true, type: "landline" };
  }

  return { valid: false, error: AU_PHONE_ERROR.INVALID_PREFIX };
};

export const normalizeAustralianNumber = (value) => {
  const sanitized = sanitizeInput(value);
  if (!sanitized) {
    return {
      valid: false,
      reason: AU_PHONE_ERROR.EMPTY,
    };
  }

  const stripped = stripFormatting(sanitized);
  if (!stripped.digits) {
    return {
      valid: false,
      reason: AU_PHONE_ERROR.NO_DIGITS,
    };
  }

  const { national, error: convertError } = convertToNational(stripped);
  if (!national) {
    return {
      valid: false,
      reason: convertError ?? AU_PHONE_ERROR.INVALID_LENGTH,
    };
  }

  const validation = validateNationalNumber(national);
  if (!validation.valid) {
    return {
      valid: false,
      reason: validation.error ?? AU_PHONE_ERROR.INVALID_PREFIX,
    };
  }

  return {
    valid: true,
    type: validation.type,
    national,
    international: buildE164(national),
    formatted: national.replace(/(\d{2})(\d{4})(\d{4})/, (match, a, b, c) => `${a} ${b} ${c}`),
  };
};

export const isAustralianNumber = (value) => normalizeAustralianNumber(value).valid;

