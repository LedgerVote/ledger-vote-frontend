// Create an array of sidebar items with all required properties
export const sidebarItems = [
  {
    name: "Dashboard",
    icon: "M3 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 6a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 6a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z",
    href: "/dashboard",
  },
  {
    name: "Create Session",
    icon: "M8 2a1 1 0 0 0-1 1v2H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2h2a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2V3a1 1 0 0 0-1-1H8zm0 2h8v8H8V4z",
    href: "/dashboard/createsession",
    //   badge: {text: "Pro", color: "gray"}
  },
  {
    name: "Handle Voters",
    icon: "M9 10a3 3 0 1 0 6 0v-1a3 3 0 1 0-6 0v1zm11 9v-1a7 7 0 0 0-14 0v1a2 2 0 0 0 4 0v-1a3 3 0 0 1 6 0v1a2 2 0 0 0 4 0zM8 2a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z",
    href: "/dashboard/handleVoters",
    //   notification: {count: "3", color: "blue"}
  },
  {
    name: "Active Sessions",
    icon: "M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6zm1 2h6v4H7V4zm0 6h6v6H7v-6z",
    href: "/dashboard/activeSessions",
    // notification: {count: "3", color: "blue"}
  },
  {
    name: "Voting",
    icon: "M18 3H6a1 1 0 0 0-1 1v14a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V4a1 1 0 0 0-1-1zm-1 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12z",
    href: "/dashboard/voting",
    // notification: {count: "3", color: "blue"}
  },
  {
    name: "Live Results",
    icon: "M16 13h-3a1 1 0 1 1 0-2h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1zm-5 2H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1zm7-8H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1z",
    href: "/dashboard/liveResults",
    // notification: {count: "3", color: "blue"}
  },
  {
    name: "Logout",
    icon: "M12 2a1 1 0 0 1 1 1v2.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 5.586V3a1 1 0 0 1 1-1zm7 9a1 1 0 0 1-1 1H8a1 1 0 0 1 0-2h10a1 1 0 0 1 1 1zm-4 4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-6z",
    href: "#",
    // notification: {count: "3", color: "blue"}
  },
  // Add remaining items similarly
];
