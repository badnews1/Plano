export default {
  admin: {
    title: "Admin Panel",
    dashboard: "Dashboard",
    users: "Users",
    
    // Statistics
    stats: {
      totalUsers: "Total Users",
      activeUsers: "Active Users",
      totalHabits: "Total Habits",
      avgHabitsPerUser: "Habits per User",
    },
    
    // Users table
    usersTable: {
      title: "Users List",
      search: "Search users...",
      loading: "Loading...",
      columns: {
        id: "ID",
        email: "Email",
        name: "Name",
        role: "Role",
        habits: "Habits",
        joinedAt: "Joined At",
        status: "Status",
        actions: "Actions",
      },
      roles: {
        user: "User",
        admin: "Administrator",
      },
      status: {
        active: "Active",
        blocked: "Blocked",
      },
      actions: {
        view: "View",
        block: "Block",
        unblock: "Unblock",
        delete: "Delete",
      },
      empty: "No users found",
      noResults: "No results found for your search",
    },
    
    // Messages
    messages: {
      userBlocked: "User blocked",
      userUnblocked: "User unblocked",
      userDeleted: "User deleted",
      actionConfirm: "Are you sure?",
    },
    
    // Navigation
    nav: {
      dashboard: "Dashboard",
      users: "Users",
      settings: "Settings",
      backToApp: "Back to App",
    },
  }
} as const;