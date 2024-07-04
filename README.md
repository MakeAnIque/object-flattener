# Object-Flatify
Transforms complex nested objects and arrays into a single-level structure, including array indices in the column names. This conversion simplifies the representation of hierarchical data, making it easier to work with in tabular formats. By flattening the data, this tool enables direct binding to CSV, Excel, and other data table formats, facilitating data manipulation, analysis, and export. This is particularly useful for preparing data for reporting, visualization, or any application that requires a flat data structure.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Installation

Instructions on how to install the package.

```bash
npm install object-flatify
```

## Usage
Typescript:
```bash
import * as objectFlatify from "object-flatify"
or
import { ObjectFlattener } from "object-flatify"
```
JavaScript:
```bash
import objectFlatify = require("object-flatify")
or
const { ObjectFlattener } = require("object-flatify")
```
### `ObjectFlattener.toDotNotation(input)`

Flattens a nested object into a single-level object with dot notation keys.

#### Parameters

- **`input`**: `Object`
  - The nested object to flatten. Must be a valid JavaScript object.
  - Example: `{ a: { b: { c: 1 } } }`

#### Returns

- **`Object`**
  - A single-level object with dot notation keys.
  - Example: `{ 'a.b.c': 1 }`

### `ObjectFlattener.toDataTableFromObject(input, [options])`

Flattens a nested object into a single-level object with dot notation keys into Excel level rows mapped.

#### Parameters

- **`input`**: `Object`
  - The nested object to flatten. Must be a valid JavaScript object.
  - Example: `{ a: { b: { c: [ {id: 1}, {id: 2} ] } } }`
- **`options`**: `Object` (Optional)
  - Additional options to customize the flattening process.
  - **`batchSize`**: `number`
    - Processes data in chunks of specified batch sizes (e.g., 100 or 200) to optimize memory utilization.
  - **`keysAscolumn`**: `true`
    - Generates possible columns based on the keys within object rows.

#### Returns

- **`Array of Object`**
  - A single-level object with dot notation keys as rows .
  - Example: `[{ 'a.b.c.id': 1 }, { 'a.b.c.id': 2 }]`


### `ObjectFlattener.toDataTableFromListAsStream(input, [options])`

Flattens a nested object into a single-level object with dot notation keys into Excel level rows mapped.

#### Parameters

- **`input`**: `Object`
  - The nested object to flatten. Must be a valid JavaScript object.
  - Example: `{ a: { b: { c: [ {id: 1}, {id: 2} ] } } }`
- **`options`**: `Object` (Optional)
  - Additional options to customize the flattening process.
  - **`batchSize`**: `number`
    - Processes data in chunks of specified batch sizes (e.g., 100 or 200) to optimize memory utilization.
  - **`keysAscolumn`**: `true`
    - Generates possible columns based on the keys within object rows.

#### Returns

- **`Event Listener`**
  - A single-level object with dot notation keys as rows .
  - **`on('data', (payload): Pick<IObjectFlattenedDataTableSet,     TObjectFlattenedInProgress> => {})`**
    - **`data`**: Array of Object single level
    - **`dataSetLength`**: Number total Dataset length
    - **`dataProcessed`**: Number count of process indexes
    - **`completed`**: Boolean completion flag
    
  - Example: `[{ 'a.b.c.id': 1 }, { 'a.b.c.id': 2 }]`


## Example

Dot notation conversion:

```bash
import { ObjectFlattener } from "object-flatify"
// nested object
export const DOCUMENT = {
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

(async() => {
  const flattened = ObjectFlattener.toDotNotation(DOCUMENT)
  console.log(flattened)

  // Output:
  /*
  {
    'company.name': 'Tech Innovators Inc.',
    'company.departments[0].name': 'Research and Development',
    'company.departments[0].manager.name': 'Alice Johnson',
    'company.departments[0].manager.employeeId': 'E1001',
    'company.departments[0].manager.contact.email': 'alice.johnson@techinnovators.com',
    'company.departments[0].manager.contact.phone': '123-456-7890',
    'company.departments[0].manager.address.street': '123 Innovation Drive',
    'company.departments[0].manager.address.city': 'Techville',
    'company.departments[0].manager.address.state': 'CA',
    'company.departments[0].manager.address.zip': '94000',
    'company.departments[0].teams[0].name': 'AI Team',
    'company.departments[0].teams[0].lead.name': 'Bob Smith',
    'company.departments[0].teams[0].lead.employeeId': 'E1002',
    'company.departments[0].teams[0].projects[0].projectId': 'P001',
    'company.departments[0].teams[0].projects[0].name': 'AI Assistant',
    'company.departments[0].teams[0].projects[0].status': 'Active',
    'company.departments[0].teams[0].projects[0].tasks[0].taskId': 'T1001',
    'company.departments[0].teams[0].projects[0].tasks[0].description': 'Develop voice recognition module',
    'company.departments[0].teams[0].projects[0].tasks[0].assignedTo.name': 'Carol Lee',
    'company.departments[0].teams[0].projects[0].tasks[0].assignedTo.employeeId': 'E1003',
    'company.departments[0].teams[0].projects[0].tasks[0].dueDate': '2024-08-01',
    'company.departments[0].teams[0].projects[0].tasks[1].taskId': 'T1002',
    'company.departments[0].teams[0].projects[0].tasks[1].description': 'Integrate with cloud services',
    'company.departments[0].teams[0].projects[0].tasks[1].assignedTo.name': 'David Kim',
    'company.departments[0].teams[0].projects[0].tasks[1].assignedTo.employeeId': 'E1004',
    'company.departments[0].teams[0].projects[0].tasks[1].dueDate': '2024-09-15',
    'company.departments[0].teams[1].name': 'Robotics Team',
    'company.departments[0].teams[1].lead.name': 'Eva Brown',
    'company.departments[0].teams[1].lead.employeeId': 'E1005',
    'company.departments[0].teams[1].projects[0].projectId': 'P002',
    'company.departments[0].teams[1].projects[0].name': 'Home Robot',
    'company.departments[0].teams[1].projects[0].status': 'Planning',
    'company.departments[0].teams[1].projects[0].tasks[0].taskId': 'T1003',
    'company.departments[0].teams[1].projects[0].tasks[0].description': 'Design prototype',
    'company.departments[0].teams[1].projects[0].tasks[0].assignedTo.name': 'Frank Green',
    'company.departments[0].teams[1].projects[0].tasks[0].assignedTo.employeeId': 'E1006',
    'company.departments[0].teams[1].projects[0].tasks[0].dueDate': '2024-07-20',
    'company.departments[1].name': 'Marketing',
    'company.departments[1].manager.name': 'Grace Hall',
    'company.departments[1].manager.employeeId': 'E1007',
    'company.departments[1].manager.contact.email': 'grace.hall@techinnovators.com',
    'company.departments[1].manager.contact.phone': '123-456-7891',
    'company.departments[1].manager.address.street': '456 Market Street',
    'company.departments[1].manager.address.city': 'Techville',
    'company.departments[1].manager.address.state': 'CA',
    'company.departments[1].manager.address.zip': '94001',
    'company.departments[1].teams[0].name': 'Digital Marketing',
    'company.departments[1].teams[0].lead.name': 'Henry White',
    'company.departments[1].teams[0].lead.employeeId': 'E1008',
    'company.departments[1].teams[0].campaigns[0].campaignId': 'C001',
    'company.departments[1].teams[0].campaigns[0].name': 'Social Media Outreach',
    'company.departments[1].teams[0].campaigns[0].status': 'Active',
    'company.departments[1].teams[0].campaigns[0].tasks[0].taskId': 'T1004',
    'company.departments[1].teams[0].campaigns[0].tasks[0].description': 'Create social media content',
    'company.departments[1].teams[0].campaigns[0].tasks[0].assignedTo.name': 'Ivy King',
    'company.departments[1].teams[0].campaigns[0].tasks[0].assignedTo.employeeId': 'E1009',
    'company.departments[1].teams[0].campaigns[0].tasks[0].dueDate': '2024-06-30',
    'company.departments[1].teams[0].campaigns[0].tasks[1].taskId': 'T10098',
    'company.departments[1].teams[0].campaigns[0].tasks[1].description': 'Create social media content',
    'company.departments[1].teams[0].campaigns[0].tasks[1].assignedTo.name': 'Ivy King',
    'company.departments[1].teams[0].campaigns[0].tasks[1].assignedTo.employeeId': 'E1009',
    'company.departments[1].teams[0].campaigns[0].tasks[1].dueDate': '2024-06-30',
    'company.departments[1].teams[0].campaigns[0].tasksLog[0].taskId': 'T1004',
    'company.departments[1].teams[0].campaigns[0].tasksLog[0].description': 'Create social media content',
    'company.departments[1].teams[0].campaigns[0].tasksLog[0].assignedTo.name': 'Ivy King',
    'company.departments[1].teams[0].campaigns[0].tasksLog[0].assignedTo.employeeId': 'E1009',
    'company.departments[1].teams[0].campaigns[0].tasksLog[0].dueDate': '2024-06-30',
    'company.departments[1].teams[0].campaigns[1].campaignId': 'C001',
    'company.departments[1].teams[0].campaigns[1].name': 'Social Media Outreach',
    'company.departments[1].teams[0].campaigns[1].status': 'Active',
    'company.departments[1].teams[0].campaigns[1].tasks[0].taskId': 'T10098',
    'company.departments[1].teams[0].campaigns[1].tasks[0].description': 'Create social media content',
    'company.departments[1].teams[0].campaigns[1].tasks[0].assignedTo.name': 'Ivy King',
    'company.departments[1].teams[0].campaigns[1].tasks[0].assignedTo.employeeId': 'E1009',
    'company.departments[1].teams[0].campaigns[1].tasks[0].dueDate': '2024-06-30',
    'company.departments[1].teams[0].campaigns[1].tasks[1].taskId': 'T1004',
    'company.departments[1].teams[0].campaigns[1].tasks[1].description': 'Create social media content',
    'company.departments[1].teams[0].campaigns[1].tasks[1].assignedTo.name': 'Ivy King',
    'company.departments[1].teams[0].campaigns[1].tasks[1].assignedTo.employeeId': 'E1009',
    'company.departments[1].teams[0].campaigns[1].tasks[1].dueDate': '2024-06-30',
    'company.departments[1].teams[0].campaigns[1].tasksLog[0].taskId': 'T1004',
    'company.departments[1].teams[0].campaigns[1].tasksLog[0].description': 'Create social media content',
    'company.departments[1].teams[0].campaigns[1].tasksLog[0].assignedTo.name': 'Ivy King',
    'company.departments[1].teams[0].campaigns[1].tasksLog[0].assignedTo.employeeId': 'E1009',
    'company.departments[1].teams[0].campaigns[1].tasksLog[0].dueDate': '2024-06-30'
  }
  */
})()
```

## Example

Dot notation conversion as like row Excels:

```bash
import { ObjectFlattener } from "object-flatify"
// nested object
export const DOCUMENT = {
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

(async() => {
  const flattened = ObjectFlattener.toDataTableFromObject(DOCUMENT, {
    keysAsColumn: true,
  })
  console.log(flattened)

  // Output:
  /*
  {
    keysAsColumn: Set(34) {
      'company.name',
      'company.departments.name',
      'company.departments.manager.name',
      'company.departments.manager.employeeId',
      'company.departments.manager.contact.email',
      'company.departments.manager.contact.phone',
      'company.departments.manager.address.street',
      'company.departments.manager.address.city',
      'company.departments.manager.address.state',
      'company.departments.manager.address.zip',
      'company.departments.teams.name',
      'company.departments.teams.lead.name',
      'company.departments.teams.lead.employeeId',
      'company.departments.teams.projects.projectId',
      'company.departments.teams.projects.name',
      'company.departments.teams.projects.status',
      'company.departments.teams.projects.tasks.taskId',
      'company.departments.teams.projects.tasks.description',
      'company.departments.teams.projects.tasks.assignedTo.name',
      'company.departments.teams.projects.tasks.assignedTo.employeeId',
      'company.departments.teams.projects.tasks.dueDate',
      'company.departments.teams.campaigns.campaignId',
      'company.departments.teams.campaigns.name',
      'company.departments.teams.campaigns.status',
      'company.departments.teams.campaigns.tasksLog.taskId',
      'company.departments.teams.campaigns.tasksLog.description',
      'company.departments.teams.campaigns.tasksLog.assignedTo.name',
      'company.departments.teams.campaigns.tasksLog.assignedTo.employeeId',
      'company.departments.teams.campaigns.tasksLog.dueDate',
      'company.departments.teams.campaigns.tasks.taskId',
      'company.departments.teams.campaigns.tasks.description',
      'company.departments.teams.campaigns.tasks.assignedTo.name',
      'company.departments.teams.campaigns.tasks.assignedTo.employeeId',
      'company.departments.teams.campaigns.tasks.dueDate'
    },
    completed: true,
    dataProcessed: 1,
    dataSetLength: 1,
    isError: false,
    data: [
      {
        'company.name': 'Tech Innovators Inc.',
        'company.departments.name': 'Research and Development',
        'company.departments.manager.name': 'Alice Johnson',
        'company.departments.manager.employeeId': 'E1001',
        'company.departments.manager.contact.email': 'alice.johnson@techinnovators.com',
        'company.departments.manager.contact.phone': '123-456-7890',
        'company.departments.manager.address.street': '123 Innovation Drive',
        'company.departments.manager.address.city': 'Techville',
        'company.departments.manager.address.state': 'CA',
        'company.departments.manager.address.zip': '94000',
        'company.departments.teams.name': 'AI Team',
        'company.departments.teams.lead.name': 'Bob Smith',
        'company.departments.teams.lead.employeeId': 'E1002',
        'company.departments.teams.projects.projectId': 'P001',
        'company.departments.teams.projects.name': 'AI Assistant',
        'company.departments.teams.projects.status': 'Active',
        'company.departments.teams.projects.tasks.taskId': 'T1001',
        'company.departments.teams.projects.tasks.description': 'Develop voice recognition module',
        'company.departments.teams.projects.tasks.assignedTo.name': 'Carol Lee',
        'company.departments.teams.projects.tasks.assignedTo.employeeId': 'E1003',
        'company.departments.teams.projects.tasks.dueDate': '2024-08-01'
      },
      {
        'company.name': 'Tech Innovators Inc.',
        'company.departments.name': 'Research and Development',
        'company.departments.manager.name': 'Alice Johnson',
        'company.departments.manager.employeeId': 'E1001',
        'company.departments.manager.contact.email': 'alice.johnson@techinnovators.com',
        'company.departments.manager.contact.phone': '123-456-7890',
        'company.departments.manager.address.street': '123 Innovation Drive',
        'company.departments.manager.address.city': 'Techville',
        'company.departments.manager.address.state': 'CA',
        'company.departments.manager.address.zip': '94000',
        'company.departments.teams.name': 'AI Team',
        'company.departments.teams.lead.name': 'Bob Smith',
        'company.departments.teams.lead.employeeId': 'E1002',
        'company.departments.teams.projects.projectId': 'P001',
        'company.departments.teams.projects.name': 'AI Assistant',
        'company.departments.teams.projects.status': 'Active',
        'company.departments.teams.projects.tasks.taskId': 'T1002',
        'company.departments.teams.projects.tasks.description': 'Integrate with cloud services',
        'company.departments.teams.projects.tasks.assignedTo.name': 'David Kim',
        'company.departments.teams.projects.tasks.assignedTo.employeeId': 'E1004',
        'company.departments.teams.projects.tasks.dueDate': '2024-09-15'
      },
      {
        'company.name': 'Tech Innovators Inc.',
        'company.departments.name': 'Research and Development',
        'company.departments.manager.name': 'Alice Johnson',
        'company.departments.manager.employeeId': 'E1001',
        'company.departments.manager.contact.email': 'alice.johnson@techinnovators.com',
        'company.departments.manager.contact.phone': '123-456-7890',
        'company.departments.manager.address.street': '123 Innovation Drive',
        'company.departments.manager.address.city': 'Techville',
        'company.departments.manager.address.state': 'CA',
        'company.departments.manager.address.zip': '94000',
        'company.departments.teams.name': 'Robotics Team',
        'company.departments.teams.lead.name': 'Eva Brown',
        'company.departments.teams.lead.employeeId': 'E1005',
        'company.departments.teams.projects.projectId': 'P002',
        'company.departments.teams.projects.name': 'Home Robot',
        'company.departments.teams.projects.status': 'Planning',
        'company.departments.teams.projects.tasks.taskId': 'T1003',
        'company.departments.teams.projects.tasks.description': 'Design prototype',
        'company.departments.teams.projects.tasks.assignedTo.name': 'Frank Green',
        'company.departments.teams.projects.tasks.assignedTo.employeeId': 'E1006',
        'company.departments.teams.projects.tasks.dueDate': '2024-07-20'
      },
      {
        'company.name': 'Tech Innovators Inc.',
        'company.departments.name': 'Marketing',
        'company.departments.manager.name': 'Grace Hall',
        'company.departments.manager.employeeId': 'E1007',
        'company.departments.manager.contact.email': 'grace.hall@techinnovators.com',
        'company.departments.manager.contact.phone': '123-456-7891',
        'company.departments.manager.address.street': '456 Market Street',
        'company.departments.manager.address.city': 'Techville',
        'company.departments.manager.address.state': 'CA',
        'company.departments.manager.address.zip': '94001',
        'company.departments.teams.name': 'Digital Marketing',
        'company.departments.teams.lead.name': 'Henry White',
        'company.departments.teams.lead.employeeId': 'E1008',
        'company.departments.teams.campaigns.campaignId': 'C001',
        'company.departments.teams.campaigns.name': 'Social Media Outreach',
        'company.departments.teams.campaigns.status': 'Active',
        'company.departments.teams.campaigns.tasksLog.taskId': 'T1004',
        'company.departments.teams.campaigns.tasksLog.description': 'Create social media content',
        'company.departments.teams.campaigns.tasksLog.assignedTo.name': 'Ivy King',
        'company.departments.teams.campaigns.tasksLog.assignedTo.employeeId': 'E1009',
        'company.departments.teams.campaigns.tasksLog.dueDate': '2024-06-30',
        'company.departments.teams.campaigns.tasks.taskId': 'T1004',
        'company.departments.teams.campaigns.tasks.description': 'Create social media content',
        'company.departments.teams.campaigns.tasks.assignedTo.name': 'Ivy King',
        'company.departments.teams.campaigns.tasks.assignedTo.employeeId': 'E1009',
        'company.departments.teams.campaigns.tasks.dueDate': '2024-06-30'
      },
      {
        'company.name': 'Tech Innovators Inc.',
        'company.departments.name': 'Marketing',
        'company.departments.manager.name': 'Grace Hall',
        'company.departments.manager.employeeId': 'E1007',
        'company.departments.manager.contact.email': 'grace.hall@techinnovators.com',
        'company.departments.manager.contact.phone': '123-456-7891',
        'company.departments.manager.address.street': '456 Market Street',
        'company.departments.manager.address.city': 'Techville',
        'company.departments.manager.address.state': 'CA',
        'company.departments.manager.address.zip': '94001',
        'company.departments.teams.name': 'Digital Marketing',
        'company.departments.teams.lead.name': 'Henry White',
        'company.departments.teams.lead.employeeId': 'E1008',
        'company.departments.teams.campaigns.campaignId': 'C001',
        'company.departments.teams.campaigns.name': 'Social Media Outreach',
        'company.departments.teams.campaigns.status': 'Active',
        'company.departments.teams.campaigns.tasksLog.taskId': 'T1004',
        'company.departments.teams.campaigns.tasksLog.description': 'Create social media content',
        'company.departments.teams.campaigns.tasksLog.assignedTo.name': 'Ivy King',
        'company.departments.teams.campaigns.tasksLog.assignedTo.employeeId': 'E1009',
        'company.departments.teams.campaigns.tasksLog.dueDate': '2024-06-30',
        'company.departments.teams.campaigns.tasks.taskId': 'T10098',
        'company.departments.teams.campaigns.tasks.description': 'Create social media content',
        'company.departments.teams.campaigns.tasks.assignedTo.name': 'Ivy King',
        'company.departments.teams.campaigns.tasks.assignedTo.employeeId': 'E1009',
        'company.departments.teams.campaigns.tasks.dueDate': '2024-06-30'
      },
      {
        'company.name': 'Tech Innovators Inc.',
        'company.departments.name': 'Marketing',
        'company.departments.manager.name': 'Grace Hall',
        'company.departments.manager.employeeId': 'E1007',
        'company.departments.manager.contact.email': 'grace.hall@techinnovators.com',
        'company.departments.manager.contact.phone': '123-456-7891',
        'company.departments.manager.address.street': '456 Market Street',
        'company.departments.manager.address.city': 'Techville',
        'company.departments.manager.address.state': 'CA',
        'company.departments.manager.address.zip': '94001',
        'company.departments.teams.name': 'Digital Marketing',
        'company.departments.teams.lead.name': 'Henry White',
        'company.departments.teams.lead.employeeId': 'E1008',
        'company.departments.teams.campaigns.campaignId': 'C001',
        'company.departments.teams.campaigns.name': 'Social Media Outreach',
        'company.departments.teams.campaigns.status': 'Active',
        'company.departments.teams.campaigns.tasksLog.taskId': 'T1004',
        'company.departments.teams.campaigns.tasksLog.description': 'Create social media content',
        'company.departments.teams.campaigns.tasksLog.assignedTo.name': 'Ivy King',
        'company.departments.teams.campaigns.tasksLog.assignedTo.employeeId': 'E1009',
        'company.departments.teams.campaigns.tasksLog.dueDate': '2024-06-30',
        'company.departments.teams.campaigns.tasks.taskId': 'T10098',
        'company.departments.teams.campaigns.tasks.description': 'Create social media content',
        'company.departments.teams.campaigns.tasks.assignedTo.name': 'Ivy King',
        'company.departments.teams.campaigns.tasks.assignedTo.employeeId': 'E1009',
        'company.departments.teams.campaigns.tasks.dueDate': '2024-06-30'
      },
      {
        'company.name': 'Tech Innovators Inc.',
        'company.departments.name': 'Marketing',
        'company.departments.manager.name': 'Grace Hall',
        'company.departments.manager.employeeId': 'E1007',
        'company.departments.manager.contact.email': 'grace.hall@techinnovators.com',
        'company.departments.manager.contact.phone': '123-456-7891',
        'company.departments.manager.address.street': '456 Market Street',
        'company.departments.manager.address.city': 'Techville',
        'company.departments.manager.address.state': 'CA',
        'company.departments.manager.address.zip': '94001',
        'company.departments.teams.name': 'Digital Marketing',
        'company.departments.teams.lead.name': 'Henry White',
        'company.departments.teams.lead.employeeId': 'E1008',
        'company.departments.teams.campaigns.campaignId': 'C001',
        'company.departments.teams.campaigns.name': 'Social Media Outreach',
        'company.departments.teams.campaigns.status': 'Active',
        'company.departments.teams.campaigns.tasksLog.taskId': 'T1004',
        'company.departments.teams.campaigns.tasksLog.description': 'Create social media content',
        'company.departments.teams.campaigns.tasksLog.assignedTo.name': 'Ivy King',
        'company.departments.teams.campaigns.tasksLog.assignedTo.employeeId': 'E1009',
        'company.departments.teams.campaigns.tasksLog.dueDate': '2024-06-30',
        'company.departments.teams.campaigns.tasks.taskId': 'T1004',
        'company.departments.teams.campaigns.tasks.description': 'Create social media content',
        'company.departments.teams.campaigns.tasks.assignedTo.name': 'Ivy King',
        'company.departments.teams.campaigns.tasks.assignedTo.employeeId': 'E1009',
        'company.departments.teams.campaigns.tasks.dueDate': '2024-06-30'
      }
    ]
  }
  */
})()
```


## Example

Dot notation conversion as like row Excels for Bulk set Stream Based:

```bash
const DOCUMENT = {
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

(async () => {
  const flattened$ = ObjectFlattener.toDataTableFromListAsStream(
    (
      [
        DOCUMENT,
        DOCUMENT,
        DOCUMENT,
        DOCUMENT,
        DOCUMENT,
        DOCUMENT,
        DOCUMENT,
        DOCUMENT,
        DOCUMENT,
      ] as TObject[]
    ).map((d: any) => JSON.parse(JSON.stringify(d))), // deep copy only for example purpose
    { keysAsColumn: true, batchSize: 2 }
  ) as Readable;

  flattened$.on("data", (data: any) => {
    console.log("Chunk Processing:", data); // chunk based on BatchSize to get as Batch Mode
  });
  flattened$.on("error", (error: any) => {
    console.log("Error has occurred:", error); // Error wile running
  });
  flattened$.on("end", (data: any) => {
    console.log("Data Processing Completed:", data); // When all process finished successfully
  });

  // Output:
  /*
  Chunk Processing: {
  data: [
    {
      'company.name': 'Tech Innovators Inc.',
      'company.departments.name': 'Research and Development',
      'company.departments.manager.name': 'Alice Johnson',
      'company.departments.manager.employeeId': 'E1001',
      'company.departments.manager.contact.email': 'alice.johnson@techinnovators.com',
      'company.departments.manager.contact.phone': '123-456-7890',
      'company.departments.manager.address.street': '123 Innovation Drive',
      'company.departments.manager.address.city': 'Techville',
      'company.departments.manager.address.state': 'CA',
      'company.departments.manager.address.zip': '94000',
      'company.departments.teams.name': 'AI Team',
      'company.departments.teams.lead.name': 'Bob Smith',
      'company.departments.teams.lead.employeeId': 'E1002',
      'company.departments.teams.projects.projectId': 'P001',
      'company.departments.teams.projects.name': 'AI Assistant',
      'company.departments.teams.projects.status': 'Active',
      'company.departments.teams.projects.tasks.taskId': 'T1001',
      'company.departments.teams.projects.tasks.description': 'Develop voice recognition module',
      'company.departments.teams.projects.tasks.assignedTo.name': 'Carol Lee',
      'company.departments.teams.projects.tasks.assignedTo.employeeId': 'E1003',
      'company.departments.teams.projects.tasks.dueDate': '2024-08-01'
    },
    {
      'company.name': 'Tech Innovators Inc.',
      'company.departments.name': 'Research and Development',
      'company.departments.manager.name': 'Alice Johnson',
      'company.departments.manager.employeeId': 'E1001',
      'company.departments.manager.contact.email': 'alice.johnson@techinnovators.com',
      'company.departments.manager.contact.phone': '123-456-7890',
      'company.departments.manager.address.street': '123 Innovation Drive',
      'company.departments.manager.address.city': 'Techville',
      'company.departments.manager.address.state': 'CA',
      'company.departments.manager.address.zip': '94000',
      'company.departments.teams.name': 'AI Team',
      'company.departments.teams.lead.name': 'Bob Smith',
      'company.departments.teams.lead.employeeId': 'E1002',
      'company.departments.teams.projects.projectId': 'P001',
      'company.departments.teams.projects.name': 'AI Assistant',
      'company.departments.teams.projects.status': 'Active',
      'company.departments.teams.projects.tasks.taskId': 'T1002',
      'company.departments.teams.projects.tasks.description': 'Integrate with cloud services',
      'company.departments.teams.projects.tasks.assignedTo.name': 'David Kim',
      'company.departments.teams.projects.tasks.assignedTo.employeeId': 'E1004',
      'company.departments.teams.projects.tasks.dueDate': '2024-09-15'
    },
    ...

  Data Processing Completed: {
    keysAsColumn: Set(34) {
      'company.name',
      'company.departments.name',
      'company.departments.manager.name',
      'company.departments.manager.employeeId',
      'company.departments.manager.contact.email',
      'company.departments.manager.contact.phone',
      'company.departments.manager.address.street',
      'company.departments.manager.address.city',
      'company.departments.manager.address.state',
      'company.departments.manager.address.zip',
      'company.departments.teams.name',
      'company.departments.teams.lead.name',
      'company.departments.teams.lead.employeeId',
      'company.departments.teams.projects.projectId',
      'company.departments.teams.projects.name',
      'company.departments.teams.projects.status',
      'company.departments.teams.projects.tasks.taskId',
      'company.departments.teams.projects.tasks.description',
      'company.departments.teams.projects.tasks.assignedTo.name',
      'company.departments.teams.projects.tasks.assignedTo.employeeId',
      'company.departments.teams.projects.tasks.dueDate',
      'company.departments.teams.campaigns.campaignId',
      'company.departments.teams.campaigns.name',
      'company.departments.teams.campaigns.status',
      'company.departments.teams.campaigns.tasksLog.taskId',
      'company.departments.teams.campaigns.tasksLog.description',
      'company.departments.teams.campaigns.tasksLog.assignedTo.name',
      'company.departments.teams.campaigns.tasksLog.assignedTo.employeeId',
      'company.departments.teams.campaigns.tasksLog.dueDate',
      'company.departments.teams.campaigns.tasks.taskId',
      'company.departments.teams.campaigns.tasks.description',
      'company.departments.teams.campaigns.tasks.assignedTo.name',
      'company.departments.teams.campaigns.tasks.assignedTo.employeeId',
      'company.departments.teams.campaigns.tasks.dueDate'
    },
    completed: true,
    dataProcessed: 9,
    dataSetLength: 9,
    isError: false
  }
  */
})();
```

## Contributing

We welcome contributions to object-flatify! Here are some ways you can help:

### Reporting Issues

If you find any bugs or have suggestions for improvements, please [open an issue](https://github.com/MakeAnIque/object-flattener/issues) on GitHub. Provide as much detail as possible, including steps to reproduce the issue if applicable.

### Submitting Pull Requests

If you'd like to contribute code, please follow these steps:

 - **Fork the Repository**: Click the "Fork" button at the top right of the repository page.
 - **Clone Your Fork**: Clone your forked repository to your local machine.
   ```bash
   git clone https://github.com/MakeAnIque/object-flattener


## Contributing

This project is licensed under the MIT License. See the LICENSE file for details.

## Author
Flattenr is created and maintained by [**`Amitabh Anand`**](https://github.com/MakeAnIque).