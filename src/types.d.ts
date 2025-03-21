// Type declarations for the application
import * as CSS from 'csstype';

// Add missing React types
declare namespace React {
  type CSSProperties = CSS.Properties;
  type FC<P = {}> = React.FunctionComponent<P>;
  type ReactNode = React.ReactElement | string | number | boolean | null | undefined;
}

// For customized modules
declare module 'miles-tree-map' {
  export interface TreeNode {
    id?: string;
    name: string;
    value?: number;
    children?: TreeNode[];
    customData?: any;
  }

  export type ColorRangeBehavior = 
    | "oneColor" 
    | "gradient" 
    | "discrete" 
    | "transparent" 
    | "borderOnly" 
    | "random" 
    | "randomRangeColor" 
    | "wild" 
    | "heatmap";

  export type TooltipPosition = 
    | "mouseRight" 
    | "mouseTop" 
    | "mouseBottom" 
    | "fixedTopLeft" 
    | "fixedTopRight" 
    | "fixedBottomLeft" 
    | "fixedBottomRight" 
    | "fixedTopCenter" 
    | "fixedBottomCenter" 
    | "nodeTopLeft" 
    | "nodeTopRight" 
    | "nodeBottomLeft" 
    | "nodeBottomRight" 
    | "nodeTopCenter" 
    | "nodeBottomCenter";

  export interface ICustomTooltipProps {
    node: TreeNode;
  }

  export interface ICustomNodeProps {
    node: TreeNode;
    width: number;
    height: number;
    backgroundColor: string;
    handleBack: () => void;
    history: TreeNode[];
  }

  export interface TreeMapProps {
    data: TreeNode;
    colorRange?: string[];
    colorRangeBehavior?: ColorRangeBehavior;
    customTooltipPosition?: TooltipPosition;
    animationDuration?: number;
    borderRadius?: number;
    paddingInner?: number;
    breadcrumbEnabled?: boolean;
    backButtonEnabled?: boolean;
    tooltipEnabled?: boolean;
    tooltipComponentRender?: (props: ICustomTooltipProps) => React.ReactElement;
    customTooltipStyle?: React.CSSProperties;
    renderComponent?: (props: ICustomNodeProps) => React.ReactElement;
  }

  export const TreeMap: React.FC<TreeMapProps>;
}

// Add csstype module
declare module 'csstype' {
  export interface Properties {
    [key: string]: any;
  }
} 