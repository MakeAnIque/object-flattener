# Object-Flatify

Transforms nested objects and arrays into a single-level structure with dot notation keys, including array indices. This simplifies hierarchical data for tabular formats like CSV or Excel, aiding data manipulation, analysis, and export for reporting or visualization.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Installation

```bash
npm install object-flatify
```

## Usage

**TypeScript:**

```typescript
import * as objectFlatify from "object-flatify";
import { ObjectFlattener } from "object-flatify";
```

**JavaScript:**

```javascript
const objectFlatify = require("object-flatify");
const { ObjectFlattener } = require("object-flatify");
```

### `ObjectFlattener.toDotNotation(input)`

Flattens a nested object into a single-level object with dot notation keys.

#### Parameters

- **`input`**: `Object`
  - A valid JavaScript object (e.g., `{ a: { b: { c: 1 } } }`).

#### Returns

- **`Object`**
  - A single-level object (e.g., `{ 'a.b.c': 1 }`).

### `ObjectFlattener.toDataTableFromObject(input, [options])`

Flattens a nested object into an array of single-level objects for tabular data.

#### Parameters

- **`input`**: `Object`
  - A valid JavaScript object.
- **`options`**: `Object` (Optional)
  - **`batchSize`**: `number` - Processes data in chunks for memory optimization.
  - **`keysAsColumn`**: `boolean` - Generates columns from object keys.

#### Returns

- **`Array of Object`**
  - Array of single-level objects with dot notation keys.

### `ObjectFlattener.toDataTableFromListAsStream(input, [options])`

Flattens a list of nested objects into a stream of single-level objects.

#### Parameters

- **`input`**: `Object[]`
  - Array of valid JavaScript objects.
- **`options`**: `Object` (Optional)
  - **`batchSize`**: `number` - Processes data in chunks.
  - **`keysAsColumn`**: `boolean` - Generates columns from object keys.

#### Returns

- **`Readable Stream`**
  - Emits events with:
    - **`data`**: Array of single-level objects.
    - **`dataSetLength`**: Total dataset length.
    - **`dataProcessed`**: Count of processed items.
    - **`completed`**: Boolean indicating completion.

### `ObjectFlattener.toDataTableFromFile(input, [options])`

Flattens a JSON file (local or remote URL) into a stream of single-level objects.

#### Parameters

- **`input`**: `string`
  - Path or URL to a JSON file (e.g., `./file.json` or `https://example.com/file.json`).
- **`options`**: `Object` (Optional)
  - **`batchSize`**: `number` - Processes data in chunks.
  - **`keysAsColumn`**: `boolean` - Generates columns from object keys.

#### Returns

- **`Readable Stream`**
  - Same event structure as `toDataTableFromListAsStream`.

## Examples

### Dot Notation Conversion

```javascript
const { ObjectFlattener } = require("object-flatify");
const DOCUMENT = {
  company: {
    name: "Tech Innovators Inc.",
    departments: [
      {
        name: "R&D",
        teams: [
          {
            name: "AI Team",
            projects: [
              {
                projectId: "P001",
                tasks: [{ taskId: "T1001", description: "Develop module" }],
              },
            ],
          },
        ],
      },
    ],
  },
};

const flattened = ObjectFlattener.toDotNotation(DOCUMENT);
console.log(flattened);
/*
{
  'company.name': 'Tech Innovators Inc.',
  'company.departments[0].name': 'R&D',
  'company.departments[0].teams[0].name': 'AI Team',
  'company.departments[0].teams[0].projects[0].projectId': 'P001',
  'company.departments[0].teams[0].projects[0].tasks[0].taskId': 'T1001',
  'company.departments[0].teams[0].projects[0].tasks[0].description': 'Develop module'
}
*/
```

### Data Table Conversion

```javascript
const flattened = ObjectFlattener.toDataTableFromObject(DOCUMENT, {
  keysAsColumn: true,
});
console.log(flattened);
/*
{
  keysAsColumn: Set(['company.name', 'company.departments.name', ...]),
  data: [{
    'company.name': 'Tech Innovators Inc.',
    'company.departments.name': 'R&D',
    'company.departments.teams.name': 'AI Team',
    'company.departments.teams.projects.projectId': 'P001',
    'company.departments.teams.projects.tasks.taskId': 'T1001',
    'company.departments.teams.projects.tasks.description': 'Develop module'
  }],
  dataProcessed: 1,
  dataSetLength: 1,
  completed: true,
  isError: false
}
*/
```

### Stream-Based Processing (List)

```javascript
const { Readable } = require("stream");
const flattened$ = ObjectFlattener.toDataTableFromListAsStream(
  [DOCUMENT, DOCUMENT],
  { keysAsColumn: true, batchSize: 1 }
);
flattened$.on("data", (data) => console.log("Chunk:", data));
flattened$.on("end", (data) => console.log("Completed:", data));
/*
Chunk: {
  data: [{
    'company.name': 'Tech Innovators Inc.',
    'company.departments.name': 'R&D',
    ...
  }],
  keysAsColumn: Set([...]),
  dataProcessed: 1,
  dataSetLength: 2,
  completed: false,
  isError: false
}
Completed: {
  keysAsColumn: Set([...]),
  dataProcessed: 2,
  dataSetLength: 2,
  completed: true,
  isError: false
}
*/
```

### File-Based Processing (Local or Remote)

```javascript
const { Readable } = require("stream");
const { ObjectFlattener } = require("object-flatify");

// Local File
const localStream = ObjectFlattener.toDataTableFromFile(
  "./dist/mock/file.json",
  { keysAsColumn: true }
);
localStream.on("data", (data) => console.log("Local Chunk:", data));
localStream.on("end", (data) => console.log("Local Completed:", data));

// Remote File
const remoteStream = ObjectFlattener.toDataTableFromFile(
  "https://examples/file.json",
  { keysAsColumn: true }
);
remoteStream.on("data", (data) => console.log("Remote Chunk:", data));
remoteStream.on("end", (data) => console.log("Remote Completed:", data));

/*
Local Chunk: {
  data: [
    { 'sepal.length': 7.4, 'sepal.width': 2.8, 'petal.length': 6.1, 'petal.width': 1.9, variety: 'Virginica' },
    ...
  ],
  keysAsColumn: Set(['sepal.length', 'sepal.width', 'petal.length', 'petal.width', 'variety']),
  dataProcessed: 10,
  dataSetLength: 150,
  completed: false,
  isError: false
}
Local Completed: {
  keysAsColumn: Set(['sepal.length', 'sepal.width', 'petal.length', 'petal.width', 'variety']),
  dataProcessed: 150,
  dataSetLength: 150,
  completed: true,
  isError: false
}

Remote Chunk: {
  data: [
    { 'sepal.length': 7.4, 'sepal.width': 2.8, 'petal.length': 6.1, 'petal.width': 1.9, variety: 'Virginica' },
    ...
  ],
  keysAsColumn: Set(['sepal.length', 'sepal.width', 'petal.length', 'petal.width', 'variety']),
  dataProcessed: 10,
  dataSetLength: 150,
  completed: false,
  isError: false
}
Remote Completed: {
  keysAsColumn: Set(['sepal.length', 'sepal.width', 'petal.length', 'petal.width', 'variety']),
  dataProcessed: 150,
  dataSetLength: 150,
  completed: true,
  isError: false
}
*/
```

## Contributing

Contribute via GitHub:

- **Report Issues**: Open an issue at [github.com/MakeAnIque/object-flattener/issues](https://github.com/MakeAnIque/object-flattener/issues).
- **Submit Pull Requests**:
  ```bash
  git clone https://github.com/MakeAnIque/object-flattener
  ```

## License

MIT License. See LICENSE file.

## Author

Created by [**Amitabh Anand**](https://github.com/MakeAnIque).
