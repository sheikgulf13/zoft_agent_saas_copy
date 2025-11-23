const COUNTRY_CODE = "61";

const MOBILE_PREFIX = "4";
const LANDLINE_PREFIXES = new Set(["2", "3", "7", "8"]);
const SPECIAL_SERVICE_PREFIXES = ["1300", "1800", "1900", "13"];

// Validation mode flags (set these booleans as needed)
// Only one should be true at a time. If multiple are true, ELSE wins last.
export let IS_AUSTRALIAN = false;
export let IS_INDIAN = false; // set true to enable Indian validation
export let IS_ELSE = true;   // when true, accept any numbers without strict validation

export const AU_PHONE_ERROR = {
  EMPTY: "EMPTY",
  NO_DIGITS: "NO_DIGITS",
  INVALID_COUNTRY_CODE: "INVALID_COUNTRY_CODE",
  INVALID_LENGTH: "INVALID_LENGTH",
  INVALID_PREFIX: "INVALID_PREFIX",
};

const normalizePassThrough = (value) => {
  const sanitized = sanitizeInput(value);
  const { digits } = stripFormatting(sanitized);
  return {
    valid: Boolean(digits && digits.length > 0),
    type: "unknown",
    national: digits || "",
    international: digits || null,
    formatted: digits || "",
  };
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

/* =========================
 * AUSTRALIA (Country code 61)
 * ========================= */

const convertInternationalSubscriber = (subscriber) => {
  if (!subscriber) {
    return { error: AU_PHONE_ERROR.INVALID_LENGTH };
  }

  if (looksLikeSpecialService(subscriber)) {
    return {
      national: clampDigits(subscriber, subscriber.startsWith("13") ? 6 : 10),
    };
  }

  // Subscriber that already has a leading 0 must be exactly 10 digits
  if (subscriber.startsWith("0")) {
    if (subscriber.length !== 10) {
      return { error: AU_PHONE_ERROR.INVALID_LENGTH };
    }
    return { national: subscriber };
  }

  // Without a leading 0, it must be exactly 9 digits and begin with valid type digit
  if (subscriber.length === 9) {
    const typeDigit = subscriber[0];
    if (typeDigit === MOBILE_PREFIX || LANDLINE_PREFIXES.has(typeDigit)) {
      return { national: `0${subscriber}` };
    }
    return { error: AU_PHONE_ERROR.INVALID_PREFIX };
  }

  return { error: AU_PHONE_ERROR.INVALID_LENGTH };
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

  // National format must be exactly 10 digits and start with 0
  if (digits.startsWith("0")) {
    if (digits.length !== 10) {
      return { error: AU_PHONE_ERROR.INVALID_LENGTH };
    }
    return { national: digits };
  }

  // Handle numbers missing the national leading zero:
  // Must be exactly 9 digits and begin with a valid type digit, otherwise invalid.
  if (digits.length === 9) {
    const typeDigit = digits[0];
    if (typeDigit === MOBILE_PREFIX || LANDLINE_PREFIXES.has(typeDigit)) {
      return { national: `0${digits}` };
    }
    return { error: AU_PHONE_ERROR.INVALID_PREFIX };
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
  // Global bypass mode: accept anything without strict validation
  if (IS_ELSE) {
    return normalizePassThrough(value);
  }

  // For now, if AU validation is disabled and ELSE is not enabled,
  // fall back to pass-through as well (ignore IN for now as requested).
  if (!IS_AUSTRALIAN) {
    return normalizePassThrough(value);
  }

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

/* =========================
 * INDIA (Country code 91)
 * ========================= */
const IN_COUNTRY_CODE = "91";
const IN_MOBILE_PREFIXES = new Set(["6", "7", "8", "9"]);
const IN_SPECIAL_PREFIXES = ["1800", "1860"];

export const IN_PHONE_ERROR = {
  EMPTY: "EMPTY",
  NO_DIGITS: "NO_DIGITS",
  INVALID_COUNTRY_CODE: "INVALID_COUNTRY_CODE",
  INVALID_LENGTH: "INVALID_LENGTH",
  INVALID_PREFIX: "INVALID_PREFIX",
};

const looksLikeINService = (digits) => {
  return IN_SPECIAL_PREFIXES.some((p) => digits.startsWith(p));
};

const buildE164IN = (national) => {
  if (!national) return null;
  const withoutTrunk = national.startsWith("0") ? national.slice(1) : national;
  return `+${IN_COUNTRY_CODE}${withoutTrunk}`;
};

const convertToNationalIN = ({ digits, hasPlus }) => {
  if (!digits) {
    return { error: IN_PHONE_ERROR.NO_DIGITS };
  }

  // Special/toll-free like 1800/1860
  if (looksLikeINService(digits)) {
    // Accept typical lengths 10-12 (e.g., 1800xxxxxx or 1860xxxxxxx)
    if (digits.length >= 10 && digits.length <= 12) {
      return { national: digits, isSpecial: true };
    }
  }

  let subscriber = digits;
  if (hasPlus) {
    if (!digits.startsWith(IN_COUNTRY_CODE)) {
      return { error: IN_PHONE_ERROR.INVALID_COUNTRY_CODE };
    }
    subscriber = digits.slice(IN_COUNTRY_CODE.length);
  } else if (digits.startsWith(IN_COUNTRY_CODE)) {
    subscriber = digits.slice(IN_COUNTRY_CODE.length);
  }

  // Remove trunk '0' if present for evaluation
  if (subscriber.startsWith("0")) {
    subscriber = subscriber.slice(1);
  }

  // Mobile: 10 digits starting with 6-9
  if (subscriber.length === 10 && IN_MOBILE_PREFIXES.has(subscriber[0])) {
    return { national: `0${subscriber}`, type: "mobile" };
  }

  // Landline (approximate): allow 10-12 digits (STD + subscriber), will add trunk '0' if missing
  if (subscriber.length >= 10 && subscriber.length <= 12) {
    return { national: `0${subscriber}`, type: "landline" };
  }

  return { error: IN_PHONE_ERROR.INVALID_LENGTH };
};

const validateNationalNumberIN = ({ national, isSpecial, type }) => {
  if (!national) {
    return { valid: false, error: IN_PHONE_ERROR.INVALID_LENGTH };
  }
  if (isSpecial) {
    return { valid: true, type: "special" };
  }
  // Mobile: 0 + 10 digits where first subscriber digit is 6-9
  if (type === "mobile") {
    if (!/^0[6-9]\d{9}$/.test(national)) {
      return { valid: false, error: IN_PHONE_ERROR.INVALID_LENGTH };
    }
    return { valid: true, type: "mobile" };
  }
  // Landline (approx): 0 + 10-12 digits
  if (type === "landline") {
    if (!/^0\d{10,12}$/.test(national)) {
      return { valid: false, error: IN_PHONE_ERROR.INVALID_LENGTH };
    }
    return { valid: true, type: "landline" };
  }
  // Fallback attempt to classify by pattern
  if (/^0[6-9]\d{9}$/.test(national)) {
    return { valid: true, type: "mobile" };
  }
  if (/^0\d{10,12}$/.test(national)) {
    return { valid: true, type: "landline" };
  }
  return { valid: false, error: IN_PHONE_ERROR.INVALID_LENGTH };
};

export const normalizeIndianNumber = (value) => {
  // Global bypass mode
  if (IS_ELSE) {
    return normalizePassThrough(value);
  }
  if (!IS_INDIAN) {
    return normalizePassThrough(value);
  }

  const sanitized = sanitizeInput(value);
  if (!sanitized) {
    return { valid: false, reason: IN_PHONE_ERROR.EMPTY };
  }
  const stripped = stripFormatting(sanitized);
  if (!stripped.digits) {
    return { valid: false, reason: IN_PHONE_ERROR.NO_DIGITS };
  }

  const { national, error: convertError, isSpecial, type } = convertToNationalIN(stripped);
  if (!national) {
    return { valid: false, reason: convertError ?? IN_PHONE_ERROR.INVALID_LENGTH };
  }

  const validation = validateNationalNumberIN({ national, isSpecial, type });
  if (!validation.valid) {
    return { valid: false, reason: validation.error ?? IN_PHONE_ERROR.INVALID_LENGTH };
  }

  const e164 = buildE164IN(national);
  const formatted =
    validation.type === "mobile"
      ? national.replace(/(\d{2})(\d{5})(\d{3})/, (m, a, b, c) => `${a} ${b} ${c}`)
      : national;
  return {
    valid: true,
    type: validation.type,
    national,
    international: e164,
    formatted,
  };
};

export const isIndianNumber = (value) => normalizeIndianNumber(value).valid;

/* =========================
 * Unified entry
 * ========================= */
export const normalizePhoneNumber = (value) => {
  if (IS_ELSE) return normalizePassThrough(value);
  if (IS_AUSTRALIAN) return normalizeAustralianNumber(value);
  if (IS_INDIAN) return normalizeIndianNumber(value);
  return normalizePassThrough(value);
};

