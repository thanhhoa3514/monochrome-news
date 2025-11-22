export interface Subscription {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  planName: string;
  planType: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  renewalDate: string;
  autoRenew: boolean;
}

export const mockSubscriptionData: Subscription[] = [
  {
    id: 1,
    userId: 1,
    userName: "John Doe",
    userEmail: "john@example.com",
    planName: "Premium Monthly",
    planType: "premium",
    status: "active",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    amount: 29.99,
    currency: "USD",
    renewalDate: "2025-02-01",
    autoRenew: true
  },
  {
    id: 2,
    userId: 2,
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    planName: "Basic Monthly",
    planType: "basic",
    status: "active",
    startDate: "2025-01-15",
    endDate: "2026-01-14",
    amount: 9.99,
    currency: "USD",
    renewalDate: "2025-02-15",
    autoRenew: true
  },
  {
    id: 3,
    userId: 5,
    userName: "Alex Johnson",
    userEmail: "alex@example.com",
    planName: "Enterprise Annual",
    planType: "enterprise",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    amount: 999.00,
    currency: "USD",
    renewalDate: "2025-06-01",
    autoRenew: true
  },
  {
    id: 4,
    userId: 3,
    userName: "Bob Wilson",
    userEmail: "bob@example.com",
    planName: "Premium Monthly",
    planType: "premium",
    status: "cancelled",
    startDate: "2024-12-01",
    endDate: "2025-01-31",
    amount: 29.99,
    currency: "USD",
    renewalDate: "2025-02-01",
    autoRenew: false
  },
  {
    id: 5,
    userId: 6,
    userName: "Emily Davis",
    userEmail: "emily@example.com",
    planName: "Basic Monthly",
    planType: "basic",
    status: "active",
    startDate: "2025-01-10",
    endDate: "2026-01-09",
    amount: 9.99,
    currency: "USD",
    renewalDate: "2025-02-10",
    autoRenew: true
  },
  {
    id: 6,
    userId: 7,
    userName: "Michael Brown",
    userEmail: "michael@example.com",
    planName: "Premium Annual",
    planType: "premium",
    status: "active",
    startDate: "2024-11-01",
    endDate: "2025-10-31",
    amount: 299.00,
    currency: "USD",
    renewalDate: "2025-11-01",
    autoRenew: true
  },
  {
    id: 7,
    userId: 8,
    userName: "Sarah Lee",
    userEmail: "sarah@example.com",
    planName: "Free Plan",
    planType: "free",
    status: "active",
    startDate: "2025-01-20",
    endDate: "2099-12-31",
    amount: 0,
    currency: "USD",
    renewalDate: "2099-12-31",
    autoRenew: false
  },
  {
    id: 8,
    userId: 4,
    userName: "Alice Brown",
    userEmail: "alice@example.com",
    planName: "Basic Monthly",
    planType: "basic",
    status: "expired",
    startDate: "2024-06-01",
    endDate: "2024-12-31",
    amount: 9.99,
    currency: "USD",
    renewalDate: "2025-01-01",
    autoRenew: false
  },
  {
    id: 9,
    userId: 9,
    userName: "David Wilson",
    userEmail: "david@example.com",
    planName: "Enterprise Monthly",
    planType: "enterprise",
    status: "active",
    startDate: "2025-01-05",
    endDate: "2026-01-04",
    amount: 99.99,
    currency: "USD",
    renewalDate: "2025-02-05",
    autoRenew: true
  },
  {
    id: 10,
    userId: 10,
    userName: "Lisa Anderson",
    userEmail: "lisa@example.com",
    planName: "Premium Monthly",
    planType: "premium",
    status: "pending",
    startDate: "2025-02-01",
    endDate: "2026-01-31",
    amount: 29.99,
    currency: "USD",
    renewalDate: "2025-03-01",
    autoRenew: true
  }
];
