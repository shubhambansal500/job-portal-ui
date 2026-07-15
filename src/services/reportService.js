import { delay } from '../utils/delay';

/**
 * Get the total number of registered users (Admin)
 */
export const getRegisteredUserCount = async () => {
  await delay();
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  return registeredUsers.length;
};
