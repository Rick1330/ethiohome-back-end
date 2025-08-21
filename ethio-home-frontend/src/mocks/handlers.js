import { http, HttpResponse } from 'msw'

// --- Mock Database / State ---
const users = { /* ... */ };
const properties = new Map();
// ... other mock data ...

// --- Handlers ---
export const handlers = [
  // ... other handlers ...
  http.post('*/api/v1/users/login', async ({ request }) => {
    const { email } = await request.json();
    const userKey = Object.keys(users).find(key => users[key].email === email);
    const user = users[userKey];
    if (user) return HttpResponse.json({ status: 'success', token: `mock-jwt-for-${user.role}`, data: { user } });
    return new HttpResponse(null, { status: 401 });
  }),

  // --- PROPERTY STATS HANDLER ---
  http.get('*/api/v1/properties/property-stats', () => {
    // Generate some realistic mock stats
    const statsOfVerified = [
      { _id: 'ADDIS ABABA', numProperty: 15, avgPrice: 180000, minPrice: 90000, maxPrice: 400000 },
      { _id: 'HAWASSA', numProperty: 8, avgPrice: 95000, minPrice: 60000, maxPrice: 150000 },
      { _id: 'BAHIR DAR', numProperty: 5, avgPrice: 110000, minPrice: 75000, maxPrice: 160000 },
    ];
    const statsOfUnverified = [
        { _id: 'ADDIS ABABA', numProperty: 4, avgPrice: 120000, minPrice: 70000, maxPrice: 200000 },
        { _id: 'HAWASSA', numProperty: 2, avgPrice: 75000, minPrice: 50000, maxPrice: 100000 },
    ];

    return HttpResponse.json({
      status: 'success',
      data: {
        statsOfVerified,
        statsOfUnverified,
      },
    });
  }),
];
