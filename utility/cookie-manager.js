const CookieManager = {
  // Set a cookie
  setCookie: (name, value, days = 7) => {
    if (typeof window === "undefined") {
      return null; // Return null if not running in the browser
    }
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(
      value
    )};expires=${expires.toUTCString()};path=/`;
  },

  // Get a cookie by name
  getCookie: (name) => {
    if (typeof window === "undefined") {
      return null; // Return null if not running in the browser
    }
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, val] = cookie.split("=");
      if (key === name) {
        return decodeURIComponent(val);
      }
    }
    return null;
  },

  // Delete a cookie
  deleteCookie: (name) => {
    if (typeof window === "undefined") {
      return null; // Return null if not running in the browser
    }
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  },

  // Get all cookies as an object
  getAllCookies: () => {
    if (typeof window === "undefined") {
      return null; // Return null if not running in the browser
    }
    return document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, val] = cookie.split("=");
      acc[key] = decodeURIComponent(val);
      return acc;
    }, {});
  },
};

export { CookieManager };
