export const DOCUMENT_TYPE_2 = {
  company: {
    name: "Tech Innovators Inc.",
    departments: [
      {
        name: "Research and Development",
        manager: {
          name: "Alice Johnson",
          employeeId: "E1001",
          contact: {
            email: "alice.johnson@techinnovators.com",
            phone: "123-456-7890",
          },
          address: {
            street: "123 Innovation Drive",
            city: "Techville",
            state: "CA",
            zip: "94000",
          },
        },
        teams: [
          {
            name: "AI Team",
            lead: {
              name: "Bob Smith",
              employeeId: "E1002",
            },
            projects: [
              {
                projectId: "P001",
                name: "AI Assistant",
                status: "Active",
                tasks: [
                  {
                    taskId: "T1001",
                    description: "Develop voice recognition module",
                    assignedTo: {
                      name: "Carol Lee",
                      employeeId: "E1003",
                    },
                    dueDate: "2024-08-01",
                  },
                  {
                    taskId: "T1002",
                    description: "Integrate with cloud services",
                    assignedTo: {
                      name: "David Kim",
                      employeeId: "E1004",
                    },
                    dueDate: "2024-09-15",
                  },
                ],
              },
            ],
          },
          {
            name: "Robotics Team",
            lead: {
              name: "Eva Brown",
              employeeId: "E1005",
            },
            projects: [
              {
                projectId: "P002",
                name: "Home Robot",
                status: "Planning",
                tasks: [
                  {
                    taskId: "T1003",
                    description: "Design prototype",
                    assignedTo: {
                      name: "Frank Green",
                      employeeId: "E1006",
                    },
                    dueDate: "2024-07-20",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Marketing",
        manager: {
          name: "Grace Hall",
          employeeId: "E1007",
          contact: {
            email: "grace.hall@techinnovators.com",
            phone: "123-456-7891",
          },
          address: {
            street: "456 Market Street",
            city: "Techville",
            state: "CA",
            zip: "94001",
          },
        },
        teams: [
          {
            name: "Digital Marketing",
            lead: {
              name: "Henry White",
              employeeId: "E1008",
            },
            campaigns: [
              {
                campaignId: "C001",
                name: "Social Media Outreach",
                status: "Active",
                tasks: [
                  {
                    taskId: "T1004",
                    description: "Create social media content",
                    assignedTo: {
                      name: "Ivy King",
                      employeeId: "E1009",
                    },
                    dueDate: "2024-06-30",
                  },
                  {
                    taskId: "T10098",
                    description: "Create social media content",
                    assignedTo: {
                      name: "Ivy King",
                      employeeId: "E1009",
                    },
                    dueDate: "2024-06-30",
                  },
                ],
                tasksLog: [
                  {
                    taskId: "T1004",
                    description: "Create social media content",
                    assignedTo: {
                      name: "Ivy King",
                      employeeId: "E1009",
                    },
                    dueDate: "2024-06-30",
                  },
                ],
              },
              {
                campaignId: "C001",
                name: "Social Media Outreach",
                status: "Active",
                tasks: [
                  {
                    taskId: "T10098",
                    description: "Create social media content",
                    assignedTo: {
                      name: "Ivy King",
                      employeeId: "E1009",
                    },
                    dueDate: "2024-06-30",
                  },
                  {
                    taskId: "T1004",
                    description: "Create social media content",
                    assignedTo: {
                      name: "Ivy King",
                      employeeId: "E1009",
                    },
                    dueDate: "2024-06-30",
                  },
                ],
                tasksLog: [
                  {
                    taskId: "T1004",
                    description: "Create social media content",
                    assignedTo: {
                      name: "Ivy King",
                      employeeId: "E1009",
                    },
                    dueDate: "2024-06-30",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
