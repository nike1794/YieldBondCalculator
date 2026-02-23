import { BOND_CALCULATE_API_URL } from '../constants';

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const calculateBond = async (requestBody) => {
  const response = await fetch(BOND_CALCULATE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok || !payload?.success || !payload?.data) {
    throw new Error(payload?.message || `API request failed with status ${response.status}`);
  }

  return payload.data;
};
