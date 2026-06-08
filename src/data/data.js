export const data = {
  name: "B2R",
  children: [
  {
      name: "Linux",
      children: [
        {
          name: "Foothold",
          children: [
            { name: "Nmap" },
            { name: "FTP" },
            { name: "Web" }
          ]
        },
        {
          name: "PrivEsc",
          children: [
            { name: "Sudo" },
            { name: "Cron" },
            { name: "Pivoting" }
          ]
        }
    ],
  },
  {
    name: "Windows",
    children: [
      {
        name: "Foothold",
        children: [
          { name: "Nmap" },
          { name: "FTP" },
          { name: "Web" }
        ]
      },
      {
        name: "PrivEsc",
        children: [
          { name: "Sudo" },
          { name: "Cron" },
          { name: "Pivoting" }
        ]
      }
    ],
  }
  
  ]
};