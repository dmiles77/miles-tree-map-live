import React from "react";
import { TreeNode, ICustomTooltipProps } from "miles-tree-map";

// Component to recursively render customData in a list format
const DataList = ({ data }: { data: any }) => {
  if (!data) return null;
  
  // Format a single value based on its type
  const formatValue = (value: any): React.ReactNode => {
    if (value === null) return <span className="null-value">null</span>;
    if (typeof value === "object") {
      return <DataList data={value} />;
    }
    return String(value);
  };
  
  // Style for the list container
  const listStyle: React.CSSProperties = {
    listStyle: "none",
    padding: 0,
    margin: 0
  };
  
  // Style for individual list items
  const itemStyle: React.CSSProperties = {
    padding: "2px 0"
  };
  
  // Style for property keys
  const keyStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.9)"
  };
  
  return (
    <ul style={listStyle}>
      {Object.entries(data).map(([key, value], index) => (
        <li key={index} style={itemStyle}>
          <span style={keyStyle}>{key}: </span>
          {formatValue(value)}
        </li>
      ))}
    </ul>
  );
};

// Component to visualize the node's children in a tree structure
const ChildrenTree = ({ node }: { node: TreeNode }) => {
  if (!node.children || node.children.length === 0) {
    return <div style={{ fontStyle: 'italic', opacity: 0.7 }}>No children</div>;
  }
  
  // Styles for the tree
  const treeStyles = {
    container: {
      marginTop: "5px"
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: 0
    },
    item: {
      position: "relative" as "relative",
      paddingLeft: "16px",
      marginBottom: "4px"
    },
    connector: {
      position: "absolute" as "absolute",
      left: "0",
      top: "10px",
      width: "12px",
      height: "1px",
      backgroundColor: "rgba(255, 255, 255, 0.4)"
    },
    nodeBox: {
      padding: "4px 8px",
      borderRadius: "3px",
      fontSize: "11px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      display: "inline-block",
      minWidth: "30px",
      textAlign: "center" as "center"
    },
    valueLabel: {
      fontSize: "10px",
      opacity: 0.7,
      marginLeft: "5px"
    },
    badge: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      fontSize: "9px",
      padding: "1px 4px",
      borderRadius: "10px",
      marginLeft: "4px",
      position: "relative" as "relative",
      top: "-1px"
    }
  };
  
  // Recursive function to render child nodes
  const renderNode = (childNode: TreeNode) => {
    const hasGrandchildren = childNode.children && childNode.children.length > 0;
    return (
      <li style={{
        ...treeStyles.item,
        marginBottom: "3px"  // Reduce from 4px to fit more items
      }} key={childNode.id || childNode.name}>
        <div style={treeStyles.connector}></div>
        <div style={{
          ...treeStyles.nodeBox,
          padding: "3px 6px"  // Reduce padding from 4px 8px
        }}>
          {childNode.name}
          {childNode.value !== undefined && 
            <span style={treeStyles.valueLabel}>({childNode.value})</span>}
          {hasGrandchildren && 
            <span style={treeStyles.badge}>{childNode.children?.length}</span>}
        </div>
        {hasGrandchildren && childNode.children && childNode.children.length <= 3 && (
          <ul style={treeStyles.list}>
            {childNode.children.map(grandchild => renderNode(grandchild))}
          </ul>
        )}
      </li>
    );
  };
  
  return (
    <div style={treeStyles.container}>
      <ul style={treeStyles.list}>
        {node.children.map(child => renderNode(child))}
      </ul>
    </div>
  );
};

// The custom tooltip component - simply returns the content
// The TreeMap component will handle positioning and boundaries
const CustomTooltip = ({ node }: ICustomTooltipProps) => {
  // Count children and calculate total descendants
  const childCount = node.children?.length || 0;
  
  // Calculate total descendants (recursive function)
  const countDescendants = (n: TreeNode): number => {
    if (!n.children || n.children.length === 0) return 0;
    return n.children.length + n.children.reduce((sum, child) => sum + countDescendants(child), 0);
  };
  
  const totalDescendants = countDescendants(node);
  
  // Only focus on content styling, no positioning properties
  const contentStyle: React.CSSProperties = {
    color: "#fff",
    textShadow: "0 0 3px rgba(0, 0, 0, 0.9)",
    padding: "6px 8px",
    maxWidth: "550px",
    maxHeight: "220px",  // Increased from 180px to accommodate taller tree section
  };

  // Header container style
  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    paddingBottom: "3px"
  };

  // Name style with better contrast
  const nameStyle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: "14px",
  };

  // Style for stats in header
  const headerStatsStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.9)"
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: "10px",
    opacity: 0.8
  };

  const statValueStyle: React.CSSProperties = {
    fontWeight: "bold",
    marginRight: "3px"
  };

  // Style for the properties container
  const propertiesContainerStyle: React.CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    padding: "5px",
    borderRadius: "3px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    maxHeight: "105px",
    overflowY: "auto",
    fontSize: "11px",
    marginRight: "8px",
    minWidth: "120px"  // Minimum width instead of fixed width
  };
  
  // Style for the children tree container
  const treeContainerStyle: React.CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    padding: "5px",
    borderRadius: "3px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    maxHeight: "140px",  // Increased from 105px to show more children
    overflowY: "auto",   // Ensure scrolling works when needed
    fontSize: "11px",
    minWidth: "150px"
  };

  // Style for section title
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: "bold",
    marginBottom: "3px",
    color: "rgba(255, 255, 255, 0.85)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: "2px"
  };

  // Single row layout
  const rowContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start"
  };

  // Column container for a vertical section
  const columnContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column"
  };

  return (
    <div style={contentStyle}>
      {/* Header with title and stats */}
      <div style={headerStyle}>
        <span style={nameStyle}>{node.name}</span>
        
        <div style={headerStatsStyle}>
          {node.value !== undefined && (
            <div>
              <span style={statValueStyle}>{node.value}</span>
              <span style={statLabelStyle}>value</span>
            </div>
          )}
          <div>
            <span style={statValueStyle}>{childCount}</span>
            <span style={statLabelStyle}>children</span>
          </div>
          {totalDescendants > 0 && (
            <div>
              <span style={statValueStyle}>{totalDescendants}</span>
              <span style={statLabelStyle}>descendants</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content row with properties and children tree */}
      <div style={rowContainerStyle}>
        {/* Properties section */}
        {node.customData && (
          <div style={columnContainerStyle}>
            <div style={sectionTitleStyle}>Properties</div>
            <div style={propertiesContainerStyle}>
              <DataList data={node.customData} />
            </div>
          </div>
        )}
        
        {/* Children tree visualization */}
        {childCount > 0 && (
          <div style={columnContainerStyle}>
            <div style={sectionTitleStyle}>Children Tree</div>
            <div style={treeContainerStyle}>
              <ChildrenTree node={node} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomTooltip; 