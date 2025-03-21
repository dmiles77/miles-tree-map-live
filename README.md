# Miles Tree Map Live Demo

This project showcases the capabilities and features of the [miles-tree-map](https://www.npmjs.com/package/miles-tree-map) React component library. The application provides an interactive demo environment where you can explore and configure various aspects of the TreeMap visualization.

## Features Demonstrated

The demo allows you to experiment with various TreeMap features including:

- **Multiple Data Visualizations**: Add and configure multiple TreeMap instances simultaneously
- **Color Range Behaviors**: Explore different color schemes including gradient, heatmap, discrete, and more
- **Interactive Navigation**: Test breadcrumb navigation and back button functionality
- **Custom Tooltips**: Toggle and customize tooltip appearance and positioning
- **Custom Node Rendering**: Visualize nodes with custom components and icons
- **Animation Controls**: Adjust animation duration and other visual effects
- **Layout Options**: Configure padding, border radius and other styling options
- **Responsive UI**: Collapsible control panel that works on both desktop and mobile devices

## Getting Started

### Running the Demo

1. Clone this repository
2. Install dependencies:
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install
   ```
3. Start the development server:
   ```bash
   # Using npm
   npm start

   # Using yarn
   yarn start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the demo in your browser

### Using miles-tree-map in Your Own Projects

To use the miles-tree-map component in your own React projects:

```bash
# Using npm
npm install miles-tree-map

# Using yarn
yarn add miles-tree-map
```

Basic usage:

```jsx
import { TreeMap } from 'miles-tree-map';

function App() {
  const data = {
    name: "Root",
    children: [
      { name: "Child 1", value: 100 },
      { name: "Child 2", value: 200 },
      { name: "Child 3", value: 300 }
    ]
  };

  return (
    <TreeMap 
      data={data}
      colorRange={["#4ecdc4", "#ff6b6b"]}
      colorRangeBehavior="gradient"
    />
  );
}
```

## Demo Controls Guide

The demo application includes a comprehensive control panel that allows you to:

- Edit the TreeMap data structure in JSON format
- Add or remove TreeMap instances
- Configure color schemes and behaviors
- Toggle UI features such as breadcrumbs, tooltips, and back buttons
- Adjust appearance settings like border radius and padding
- Test different tooltip positioning options
- Enable custom node and tooltip components

### Collapsible Menu

- The control panel can be toggled open/closed using the menu button in the top left corner
- When closed, the TreeMap visualization uses the full screen width
- You can also press the 'M' key on your keyboard to toggle the menu
- The menu automatically adapts to your screen size

### Mobile Experience

When viewing on mobile devices, the demo automatically:

- Transforms the control panel into a slide-out side menu (closed by default)
- Uses optimized default settings for mobile viewing:
  - Back button enabled for easier navigation
  - Breadcrumbs disabled to save space
  - Increased outer padding (10px) for better touch interaction
  - Tooltips disabled to avoid interfering with touch navigation
- Provides a more touch-friendly layout with larger areas for interaction

## Learn More

For more information about the miles-tree-map component, visit:
- [NPM Package](https://www.npmjs.com/package/miles-tree-map)
- [Documentation](https://github.com/yourusername/miles-tree-map) <!-- Update with actual documentation link if available -->
