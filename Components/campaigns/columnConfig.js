export const COLUMN_FIELD_CONFIG = {
  name: { label: "Name", required: true },
  phone: { label: "Phone number", required: true },
  email: { label: "Email" },
  info: { label: "Additional info" },
};

export const COLUMN_FIELD_PAIRS = [
  ["name", "phone"],
  ["email", "info"],
];

export const INITIAL_COLUMN_MAPPINGS = {
  name: null,
  phone: null,
  email: null,
  info: null,
};

