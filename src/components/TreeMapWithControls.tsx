import React, { useState, CSSProperties, useEffect, useRef } from "react";
import { TreeMap, TreeNode, ColorRangeBehavior, TooltipPosition, ICustomTooltipProps } from "miles-tree-map";
import { worldMap as initialWorldMap } from "../consts/consts";
import CustomTooltip from "./CustomTooltip";
import CustomNodeComponent from "./CustomNodeComponent";

// Interface for TreeMap instance data
interface TreeMapInstance {
  id: string;
  data: TreeNode;
  jsonInput: string;
  colorRange: string[];
  colorRangeBehavior: ColorRangeBehavior;
  updateKey: number;
}

// SVG Icons for menu buttons
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TreeMapWithControls: React.FC = () => {
  // Mobile detection
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(true); // Default to open on desktop
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Detect mobile devices on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // On mobile initial load, close the menu by default
      if (mobile && menuOpen) {
        setMenuOpen(false);
      }
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, [menuOpen]);

  // Handle touch gestures for mobile
  useEffect(() => {
    if (!containerRef.current || !isMobile) return;
    
    const container = containerRef.current;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX.current;
      
      // Determine if it's a swipe (more than 50px)
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && !menuOpen) {
          // Swipe right - open menu
          setMenuOpen(true);
        } else if (diffX < 0 && menuOpen) {
          // Swipe left - close menu
          setMenuOpen(false);
        }
      }
      
      touchStartX.current = null;
    };
    
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, menuOpen]);

  // Add keyboard shortcut for toggling menu (keep functionality but remove visual hint)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm') {
        toggleMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Create a function to generate a new TreeMap instance with default values
  const createNewTreeMapInstance = (): TreeMapInstance => ({
    id: `tree-map-${Date.now()}`,
    data: { ...initialWorldMap },
    jsonInput: JSON.stringify(initialWorldMap, null, 2),
    colorRange: ["#4ecdc4", "#ff6b6b"],
    colorRangeBehavior: "heatmap" as ColorRangeBehavior,
    updateKey: 0
  });

  // Initialize with one TreeMap instance
  const [treeMapInstances, setTreeMapInstances] = useState<TreeMapInstance[]>([
    createNewTreeMapInstance()
  ]);

  // Global settings (shared across all TreeMaps)
  // Initialize with different values based on device
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>("mouseRight");
  const [animationDuration, setAnimationDuration] = useState<number>(300);
  const [paddingInner, setPaddingInner] = useState<number>(5);
  const [paddingOuter, setPaddingOuter] = useState<number>(isMobile ? 10 : 50);
  const [borderRadius, setBorderRadius] = useState<number>(2);
  const [breadcrumbEnabled, setBreadcrumbEnabled] = useState<boolean>(!isMobile);
  const [backButtonEnabled, setBackButtonEnabled] = useState<boolean>(isMobile);
  const [tooltipEnabled, setTooltipEnabled] = useState<boolean>(!isMobile);
  const [customTooltipEnabled, setCustomTooltipEnabled] = useState<boolean>(false);
  const [customNodeEnabled, setCustomNodeEnabled] = useState<boolean>(false);
  const [showIconsEnabled, setShowIconsEnabled] = useState<boolean>(true);

  // Update default settings when device type changes
  useEffect(() => {
    if (isMobile) {
      setBreadcrumbEnabled(false);
      setBackButtonEnabled(true);
      setPaddingOuter(10);
      setTooltipEnabled(false);
    }
  }, [isMobile]);

  // Function to add a new TreeMap instance
  const addTreeMapInstance = () => {
    setTreeMapInstances(prevInstances => [...prevInstances, createNewTreeMapInstance()]);
  };

  // Function to remove a TreeMap instance
  const removeTreeMapInstance = (idToRemove: string) => {
    setTreeMapInstances(prevInstances => prevInstances.filter(instance => instance.id !== idToRemove));
  };

  // Function to handle JSON changes for a specific TreeMap instance
  const handleJsonChange = (instanceId: string, newJson: string) => {
    setTreeMapInstances(prevInstances => 
      prevInstances.map(instance => {
        if (instance.id !== instanceId) return instance;
        
        try {
          const parsedData = JSON.parse(newJson);
          // Create a completely new deep copy using JSON stringify/parse
          const deepCopy = JSON.parse(JSON.stringify(parsedData));
          return {
            ...instance,
            jsonInput: newJson,
            data: deepCopy,
            updateKey: instance.updateKey + 1
          };
        } catch (error) {
          console.error("Invalid JSON format", error);
          return {
            ...instance,
            jsonInput: newJson
          };
        }
      })
    );
  };

  // Function to handle color changes for a specific TreeMap instance
  const handleColorChange = (instanceId: string, index: number, value: string) => {
    setTreeMapInstances(prevInstances => 
      prevInstances.map(instance => {
        if (instance.id !== instanceId) return instance;
        
        const newColorRange = [...instance.colorRange];
        newColorRange[index] = value;
        return {
          ...instance,
          colorRange: newColorRange
        };
      })
    );
  };

  // Function to handle color range behavior changes for a specific TreeMap instance
  const handleColorRangeBehaviorChange = (instanceId: string, behavior: ColorRangeBehavior) => {
    setTreeMapInstances(prevInstances => 
      prevInstances.map(instance => {
        if (instance.id !== instanceId) return instance;
        return {
          ...instance,
          colorRangeBehavior: behavior
        };
      })
    );
  };

  // Toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Custom tooltip style with transparent background
  const transparentTooltipStyle: React.CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(3px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "4px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "6px 8px",
    pointerEvents: "none",
    color: "white",
    maxWidth: "fit-content", // Auto-fit to content
    maxHeight: "230px"       // Increased to accommodate more children
  };

  // Custom tooltip renderer function
  const customTooltipRenderer = (props: ICustomTooltipProps) => {
    return <CustomTooltip {...props} />;
  };

  // Styles
  const styles: Record<string, CSSProperties> = {
    container: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row" as "column" | "row",
      height: "100vh",
      width: "100vw",
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      overflow: "hidden",
      position: "relative" as "relative",
    },
    menuButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "fixed" as "fixed",
      top: "15px",
      left: menuOpen ? (isMobile ? "calc(85% - 45px)" : "275px") : "15px", // Position based on menu state
      zIndex: 100,
      background: menuOpen ? "rgba(255, 255, 255, 0.9)" : "#4CAF50",
      color: menuOpen ? "#333" : "white",
      border: menuOpen ? "1px solid #ddd" : "none",
      borderRadius: "50%", // Makes it circular
      width: "44px",
      height: "44px",
      cursor: "pointer",
      boxShadow: menuOpen ? "0 2px 5px rgba(0,0,0,0.1)" : "0 3px 8px rgba(0,0,0,0.2)",
      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      "&:hover": {
        transform: "scale(1.05)",
      },
    },
    controlPanel: {
      flex: "none",
      width: isMobile ? "85%" : "320px", // Fixed width on desktop
      height: "100%",
      padding: "20px",
      borderRight: "1px solid #e0e0e0",
      overflowY: "auto" as "auto",
      backgroundColor: "#fff",
      boxShadow: "0 0 15px rgba(0,0,0,0.05)",
      position: "fixed" as "fixed", // Always fixed position
      left: menuOpen ? "0" : (isMobile ? "-100%" : "-320px"), // Completely hide when closed
      top: 0,
      zIndex: 50,
      transition: "left 0.3s ease-in-out",
      paddingTop: "70px", // More space for the menu button
    },
    overlay: {
      display: menuOpen && isMobile ? "block" : "none", // Only show overlay on mobile
      position: "fixed" as "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 40,
    },
    heading: {
      color: "#2c3e50",
      marginBottom: "25px",
      paddingBottom: "10px",
      borderBottom: "1px solid #3498db",
      fontWeight: 600,
      fontSize: "20px",
    },
    section: {
      marginBottom: "25px",
      padding: "15px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: 600,
      marginBottom: "15px",
      color: "#3498db",
    },
    controlGroup: {
      marginBottom: "18px",
    },
    dataConfigContainer: {
      borderBottom: "1px solid #eee",
      paddingBottom: "15px",
      marginBottom: "15px",
    },
    dataHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    removeButton: {
      backgroundColor: "#ff6b6b",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "6px 10px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#ff5252",
      },
    },
    addButton: {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none", 
      borderRadius: "6px",
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "10px auto",
      width: "100%",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "all 0.2s ease",
    },
    closeButton: {
      backgroundColor: "#3498db",
      color: "white",
      border: "none", 
      borderRadius: "6px",
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      margin: "10px auto 20px",
      width: "100%",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "all 0.2s ease",
    },
    label: {
      display: "block",
      fontWeight: 500,
      marginBottom: "6px",
      color: "#34495e",
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      marginTop: "5px",
      fontSize: "14px",
      boxSizing: "border-box" as "border-box",
      transition: "border 0.2s ease",
      "&:focus": {
        borderColor: "#3498db",
        outline: "none",
      }
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      marginTop: "5px",
      fontFamily: "monospace",
      minHeight: isMobile ? "120px" : "200px",
      maxHeight: isMobile ? "300px" : "600px",
      fontSize: "14px",
      boxSizing: "border-box" as "border-box",
      overflowY: "auto" as "auto",
      resize: "vertical" as "vertical",
      wordBreak: "break-all" as "break-all",
    },
    select: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      marginTop: "5px",
      fontSize: "14px",
      backgroundColor: "white",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 10px center",
      backgroundSize: "16px",
    },
    colorInputGroup: {
      display: "flex",
      gap: "10px",
      marginTop: "8px",
    },
    colorInput: {
      minWidth: "40px",
      height: "40px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      cursor: "pointer",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    checkbox: {
      marginLeft: "10px",
      transform: "scale(1.2)",
      accentColor: "#3498db",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      fontWeight: 500,
      color: "#34495e",
    },
    treeMapContainer: {
      flex: 1,
      position: "relative" as "relative",
      overflow: "hidden",
      display: "flex",
      flexWrap: "wrap" as "wrap",
      marginTop: isMobile ? "0" : 0,
      marginLeft: menuOpen && !isMobile ? "320px" : 0, // Give space for fixed menu on desktop
      height: "100%",
      width: isMobile ? "100%" : (menuOpen ? "calc(100% - 320px)" : "100%"), // Adjust width based on menu state
      transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
    },
    singleTreeMap: {
      boxSizing: "border-box" as "border-box",
      border: "1px solid rgba(0, 0, 0, 0.1)",
      position: "relative" as "relative",
    },
    swipeHint: {
      display: isMobile && !menuOpen ? "flex" : "none",
      position: "fixed" as "fixed",
      left: "5px",
      top: "50%",
      transform: "translateY(-50%)",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(52, 152, 219, 0.1)",
      padding: "15px 5px",
      borderRadius: "0 4px 4px 0",
      zIndex: 30,
      animation: "pulse 2s infinite",
    }
  };

  // Calculate the grid layout for the TreeMaps
  const getTreeMapLayout = (index: number, total: number): CSSProperties => {
    // For mobile, always use full width
    if (isMobile) {
      return {
        width: "100%",
        height: total > 1 ? "50%" : "100%"
      };
    }
    
    // For desktop
    let width = "100%";
    let height = "100%";
    
    if (total === 2) {
      // For 2 maps, split horizontally
      width = "100%";
      height = "50%";
    } else if (total === 3 || total === 4) {
      // For 3-4 maps, use a 2x2 grid
      width = "50%";
      height = "50%";
    } else if (total > 4) {
      // For 5+ maps, use a more dynamic approach
      const cols = Math.ceil(Math.sqrt(total));
      const rows = Math.ceil(total / cols);
      width = `${100 / cols}%`;
      height = `${100 / rows}%`;
    }
    
    return {
      width,
      height,
    };
  };

  return (
    <div style={styles.container} ref={containerRef}>
      {/* Menu toggle button with proper icons */}
      <button 
        style={styles.menuButton} 
        onClick={toggleMenu}
        title={menuOpen ? "Hide Menu" : "Show Menu"}
      >
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
      
      {/* Subtle swipe hint for mobile (only shown when menu is closed) */}
      {isMobile && !menuOpen && (
        <div style={styles.swipeHint}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      
      {/* Overlay for mobile when menu is open */}
      <div style={styles.overlay} onClick={toggleMenu}></div>
      
      <div style={styles.controlPanel}>
        <h3 style={styles.heading}>TreeMap Controls</h3>
        
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Data Configuration</h4>
          
          {treeMapInstances.map((instance, index) => (
            <div key={instance.id} style={styles.dataConfigContainer}>
              <div style={styles.dataHeader}>
                <h5 style={{ margin: 0 }}>Data JSON {index + 1}</h5>
                {treeMapInstances.length > 1 && (
                  <button 
                    style={styles.removeButton} 
                    onClick={() => removeTreeMapInstance(instance.id)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Remove
                  </button>
                )}
              </div>
              
              <div style={styles.controlGroup}>
                <textarea
                  value={instance.jsonInput}
                  onChange={(e) => handleJsonChange(instance.id, e.target.value)}
                  style={styles.textarea}
                />
              </div>
              
              <div style={styles.controlGroup}>
                <label style={styles.label}>Color Range:</label>
                <div style={styles.colorInputGroup}>
                  {instance.colorRange.map((color, colorIndex) => (
                    <input
                      key={colorIndex}
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(instance.id, colorIndex, e.target.value)}
                      style={styles.colorInput}
                      title={`Color ${colorIndex + 1}: ${color}`}
                    />
                  ))}
                </div>
              </div>
              
              <div style={styles.controlGroup}>
                <label style={styles.label}>Color Range Behavior:</label>
                <select
                  value={instance.colorRangeBehavior}
                  onChange={(e) => handleColorRangeBehaviorChange(instance.id, e.target.value as ColorRangeBehavior)}
                  style={styles.select}
                >
                  <option value="oneColor">One Color</option>
                  <option value="gradient">Gradient</option>
                  <option value="discrete">Discrete</option>
                  <option value="transparent">Transparent</option>
                  <option value="borderOnly">Border Only</option>
                  <option value="random">Random</option>
                  <option value="randomRangeColor">Random Range Color</option>
                  <option value="wild">Wild</option>
                  <option value="heatmap">Heatmap</option>
                </select>
              </div>
            </div>
          ))}
          
          <button 
            style={styles.addButton} 
            onClick={addTreeMapInstance}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add New TreeMap
          </button>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Global Appearance</h4>
          <div style={styles.controlGroup}>
            <label style={styles.label}>Border Radius:</label>
            <input
              type="number"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              min="0"
              style={styles.input}
            />
          </div>
          
          <div style={styles.controlGroup}>
            <label style={styles.label}>Padding Inner:</label>
            <input
              type="number"
              value={paddingInner}
              onChange={(e) => setPaddingInner(Number(e.target.value))}
              min="0"
              style={styles.input}
            />
          </div>
          
          <div style={styles.controlGroup}>
            <label style={styles.label}>Padding Outer:</label>
            <input
              type="number"
              value={paddingOuter}
              onChange={(e) => setPaddingOuter(Number(e.target.value))}
              min="0"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Animation & Interaction</h4>
          <div style={styles.controlGroup}>
            <label style={styles.label}>Animation Duration (ms):</label>
            <input
              type="number"
              value={animationDuration}
              onChange={(e) => setAnimationDuration(Number(e.target.value))}
              min="0"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>UI Features</h4>
          <div style={styles.controlGroup}>
            <label style={styles.label}>Tooltip Position:</label>
            <select
              value={tooltipPosition}
              onChange={(e) => setTooltipPosition(e.target.value as TooltipPosition)}
              style={styles.select}
            >
              <option value="mouseRight">Mouse Right</option>
              <option value="mouseTop">Mouse Top</option>
              <option value="mouseBottom">Mouse Bottom</option>
              <option value="fixedTopLeft">Fixed Top Left</option>
              <option value="fixedTopRight">Fixed Top Right</option>
              <option value="fixedBottomLeft">Fixed Bottom Left</option>
              <option value="fixedBottomRight">Fixed Bottom Right</option>
              <option value="fixedTopCenter">Fixed Top Center</option>
              <option value="fixedBottomCenter">Fixed Bottom Center</option>
              <option value="nodeTopLeft">Node Top Left</option>
              <option value="nodeTopRight">Node Top Right</option>
              <option value="nodeBottomLeft">Node Bottom Left</option>
              <option value="nodeBottomRight">Node Bottom Right</option>
              <option value="nodeTopCenter">Node Top Center</option>
              <option value="nodeBottomCenter">Node Bottom Center</option>
            </select>
          </div>
          
          <div style={styles.controlGroup}>
            <label style={styles.checkboxLabel}>
              <span>Tooltip Enabled:</span>
              <input
                type="checkbox"
                checked={tooltipEnabled}
                onChange={(e) => setTooltipEnabled(e.target.checked)}
                style={styles.checkbox}
              />
            </label>
          </div>
          
          <div style={styles.controlGroup}>
            <label style={styles.checkboxLabel}>
              <span>Use Custom Tooltip:</span>
              <input
                type="checkbox"
                checked={customTooltipEnabled}
                onChange={(e) => setCustomTooltipEnabled(e.target.checked)}
                style={styles.checkbox}
              />
            </label>
          </div>
          
          <div style={styles.controlGroup}>
            <label style={styles.checkboxLabel}>
              <span>Use Custom Nodes:</span>
              <input
                type="checkbox"
                checked={customNodeEnabled}
                onChange={(e) => setCustomNodeEnabled(e.target.checked)}
                style={styles.checkbox}
              />
            </label>
          </div>
          
          {customNodeEnabled && (
            <div style={styles.controlGroup}>
              <label style={styles.checkboxLabel}>
                <span>Show Icons in Nodes:</span>
                <input
                  type="checkbox"
                  checked={showIconsEnabled}
                  onChange={(e) => setShowIconsEnabled(e.target.checked)}
                  style={styles.checkbox}
                />
              </label>
            </div>
          )}
          
          <div style={styles.controlGroup}>
            <label style={styles.checkboxLabel}>
              <span>Breadcrumb Enabled:</span>
              <input
                type="checkbox"
                checked={breadcrumbEnabled}
                onChange={(e) => setBreadcrumbEnabled(e.target.checked)}
                style={styles.checkbox}
              />
            </label>
          </div>
          
          <div style={styles.controlGroup}>
            <label style={styles.checkboxLabel}>
              <span>Back Button Enabled:</span>
              <input
                type="checkbox"
                checked={backButtonEnabled}
                onChange={(e) => setBackButtonEnabled(e.target.checked)}
                style={styles.checkbox}
              />
            </label>
          </div>
        </div>
        
        <button 
          style={styles.closeButton} 
          onClick={toggleMenu}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Close Menu
        </button>
      </div>
      
      <div style={styles.treeMapContainer}>
        {treeMapInstances.map((instance, index) => {
          const layoutStyle = getTreeMapLayout(index, treeMapInstances.length);
          
          return (
            <div 
              key={instance.id} 
              style={{
                ...styles.singleTreeMap,
                ...layoutStyle
              }}
            >
              <TreeMap
                key={instance.updateKey}
                data={instance.data}
                colorRange={instance.colorRange}
                renderComponent={customNodeEnabled ? 
                  (props) => <CustomNodeComponent {...props} showIcons={showIconsEnabled} /> : 
                  undefined
                }
                colorRangeBehavior={instance.colorRangeBehavior}
                customTooltipPosition={tooltipPosition}
                animationDuration={animationDuration}
                borderRadius={borderRadius}
                paddingInner={paddingInner}
                paddingOuter={paddingOuter}
                breadcrumbEnabled={breadcrumbEnabled}
                backButtonEnabled={backButtonEnabled}
                tooltipEnabled={tooltipEnabled}
                tooltipComponentRender={customTooltipEnabled ? customTooltipRenderer : undefined}
                customTooltipStyle={customTooltipEnabled ? transparentTooltipStyle : undefined}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TreeMapWithControls;
