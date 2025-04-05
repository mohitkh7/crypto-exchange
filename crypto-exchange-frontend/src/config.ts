const API_HOST = 'http://localhost:4000'; // Change this to your desired API host

export const API_URLS = {
  auth: {
    login: `${API_HOST}/api/auth/login`,
    register: `${API_HOST}/api/auth/register`,
  },
  account: {
    balance: `${API_HOST}/api/users/balance`,
    actions: (action: string) => `${API_HOST}/api/account/${action}`,
  },
  crypto: {
    balance: `${API_HOST}/api/crypto/balance`,
    buy: `${API_HOST}/api/crypto/buy`,
    sell: `${API_HOST}/api/crypto/sell`,
    price: `${API_HOST}/api/crypto/price`,
  },
};
