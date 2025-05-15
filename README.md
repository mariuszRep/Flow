# React Flow Editor

A customizable node-based editor built with React Flow, featuring different node types with configurable input and output connections.

## Features

- **Start Node**: A node with only output connections
- **End Node**: A node with only input connections
- **Many-to-One Node**: A node that accepts multiple inputs but has only one output
- **Many-to-Many Node**: A node with multiple inputs and toggleable multiple outputs

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Technologies Used

- React
- TypeScript
- React Flow (@xyflow/react)
- Tailwind CSS
- Headless UI

## Node Types

### Start Node
The Start Node is the entry point of your flow. It only has output handles on the right side.

### End Node
The End Node is the terminal point of your flow. It only has input handles on the left side.

### Many-to-One Node
This node accepts multiple inputs on the left side but has only one output on the right side.

### Many-to-Many Node
This node accepts multiple inputs on the left side and can have either one or multiple outputs on the right side, controlled by a toggle switch.

## License

MIT
