# Component Guide

This guide explains how to add new components to the Hub & Spoke Carbon Model application.

## Overview

The application uses a tab-based navigation system that organizes components into four categories:
- **Capture**: Components related to carbon capture
- **Distribution**: Components related to transport and distribution
- **Processing**: Components related to processing captured carbon
- **Revenue**: Components related to revenue calculations

## Adding a New Component

Follow these four simple steps to add a new component:

### Step 1: Create Your Component

Create a new React component file in the `src/components/` directory:

```jsx
// src/components/MyNewComponent.jsx
import { useState } from 'react';

export default function MyNewComponent() {
    const [value, setValue] = useState(0);
    
    return (
        <div>
            <h2>My New Component</h2>
            <p>Your component content goes here</p>
        </div>
    );
}
```

### Step 2: Import the Component

Open `src/pages/index.astro` and add your import at the top:

```js
---
// Import all components here
import CarbonCalculator from '../components/CarbonCalculator.jsx';
import SorbentCapture from '../components/SorbentCapture.jsx';
import MyNewComponent from '../components/MyNewComponent.jsx'; // Add this line
```

### Step 3: Add to Component Configuration

In the same `index.astro` file, add your component to the `componentConfig` array:

```js
const componentConfig = [
    // Capture Components
    { category: 'Capture', id: 'sorbent-capture', label: 'Sorbent Capture' },
    { category: 'Capture', id: 'carbon-calculator', label: 'Carbon Calculator' },
    
    // Distribution Components
    { category: 'Distribution', id: 'my-new-component', label: 'My New Component' },
    
    // ... rest of the config
];
```

### Step 4: Add Component to HTML

Scroll down to the "Component Container" section in the same file and add your component markup:

```html
<!-- Component Container -->
<div class="component-container">
    <div id="empty-state" class="empty-state">
        <h2>Welcome!</h2>
        <p>Select a component from above to get started.</p>
    </div>
    
    <!-- Add your components here with their corresponding data-component-id -->
    <div class="component-wrapper" data-component-id="sorbent-capture">
        <SorbentCapture client:only="react" />
    </div>
    <div class="component-wrapper" data-component-id="carbon-calculator">
        <CarbonCalculator client:only="react" />
    </div>
    
    <!-- Add your new component here -->
    <div class="component-wrapper" data-component-id="my-new-component">
        <MyNewComponent client:only="react" />
    </div>
</div>
```

**Important**: The `data-component-id` must match the `id` you used in Step 3!

## Configuration Object Properties

Each component entry in `componentConfig` requires three properties:

| Property | Description | Example |
|----------|-------------|---------|
| `category` | The category this component belongs to | `'Capture'`, `'Distribution'`, `'Processing'`, or `'Revenue'` |
| `id` | A unique identifier (kebab-case recommended) | `'my-new-component'` |
| `label` | The display name shown in the tab | `'My New Component'` |

## Important Notes

- **IDs must be unique**: No two components can share the same `id`
- **IDs must match**: The `id` in `componentConfig` must match the `data-component-id` in the HTML
- **Category names**: Must match exactly: `'Capture'`, `'Distribution'`, `'Processing'`, or `'Revenue'`
- **Component ordering**: Components appear in the order they're listed in the config
- **Lazy loading**: Components use `client:only="react"` directive for client-side hydration

## Complete Example: Adding a Network Analysis Component

Here's a complete example of adding a new Distribution component:

### 1. Import (top of index.astro)
```js
import NetworkAnalysis from '../components/NetworkAnalysis.jsx';
```

### 2. Configuration (in componentConfig array)
```js
{ category: 'Distribution', id: 'network-analysis', label: 'Network Analysis' },
```

### 3. HTML (in component container)
```html
<div class="component-wrapper" data-component-id="network-analysis">
    <NetworkAnalysis client:only="react" />
</div>
```

## User Experience

- By default, no component is loaded (empty state is shown)
- Users click a tab to load a component
- Only one component is active at a time
- The selected component persists across page reloads (via sessionStorage)
- Tab state is preserved behind the password prompt

## Troubleshooting

**Component not showing up?**
- Check that the import path is correct
- Verify the component is exported as default
- Make sure the `id` is unique
- Confirm the category name matches exactly
- Ensure `data-component-id` matches the `id` in config

**Build error about client:only?**
- Make sure you're using `<ComponentName client:only="react" />` directly
- Don't try to reference components through variables with client:only

**Component not rendering correctly?**
- Ensure your component doesn't have syntax errors
- Check the browser console for React errors
- Verify all dependencies are installed

**Need help?**
- Review existing components like `CarbonCalculator.jsx` and `SorbentCapture.jsx` for examples
- Check that your component follows React best practices

