export const getSimApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'https://api.uydatalim.uzedu.uz/api';

export const getSimAuthHeaders = (accessToken?: string): Record<string, string> => {
  if (accessToken) return { Authorization: `Bearer ${accessToken}` };
  if (typeof window === 'undefined') return {};
  try {
    const token = window.localStorage.getItem('sim_access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};
