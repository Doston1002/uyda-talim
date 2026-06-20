export const getSimApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
