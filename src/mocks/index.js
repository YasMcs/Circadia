export const mockUser = {
  id: "USR-001",
  name: "Yas",
  chronotype: "Oso (Intermedio)",
  energyLevel: 0.8, // 0 to 1
  preferences: {
    notifications: true,
    theme: "cyber-luxury"
  }
};

export const mockTasks = [
  {
    id: "T-001",
    title: "Aprender React Components",
    priority: "Alta",
    status: "pending",
    estimatedMinutes: 45
  },
  {
    id: "T-002",
    title: "Repaso de PostgreSQL",
    priority: "Media",
    status: "completed",
    estimatedMinutes: 30
  }
];

export const mockOrbStates = {
  OPTIMAL: { color: "var(--cyan)", description: "ESTADO ÓPTIMO" },
  STABLE: { color: "var(--violet)", description: "ESTADO ESTABLE" },
  FATIGUE: { color: "var(--red)", description: "FATIGA / VALLE" }
};
