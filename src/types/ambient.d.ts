// Ambient module fallbacks for IDE TypeScript Language Server

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module "react" {
  export type ReactNode = any;
  export type FC<T = any> = (props: T) => any;
  export const Suspense: FC<{ fallback?: any; children?: any }>;
  export function useState<T>(initial: T | (() => T)): [T, (val: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T = any>(initial?: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T;
  export function useMemo<T>(fn: () => T, deps: any[]): T;
  export function createContext<T>(defaultValue: T): any;
  export function useContext<T>(context: any): T;
  const React: any;
  export default React;
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module "next/link" {
  import { ReactNode } from "react";
  export interface LinkProps {
    href: string;
    children?: ReactNode;
    className?: string;
    target?: string;
    rel?: string;
    [key: string]: any;
  }
  export default function Link(props: LinkProps): any;
}

declare module "next/navigation" {
  export function useRouter(): {
    push(url: string): void;
    replace(url: string): void;
    back(): void;
    forward(): void;
    refresh(): void;
    prefetch(url: string): void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}

declare module "lucide-react" {
  import { FC } from "react";
  export interface IconProps {
    className?: string;
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    [key: string]: any;
  }
  export const Zap: FC<IconProps>;
  export const ShieldCheck: FC<IconProps>;
  export const Globe: FC<IconProps>;
  export const Cpu: FC<IconProps>;
  export const Play: FC<IconProps>;
  export const ArrowRight: FC<IconProps>;
  export const CheckCircle: FC<IconProps>;
  export const AlertTriangle: FC<IconProps>;
  export const RefreshCw: FC<IconProps>;
  export const Clock: FC<IconProps>;
  export const Database: FC<IconProps>;
  export const Activity: FC<IconProps>;
  export const Lock: FC<IconProps>;
  export const Server: FC<IconProps>;
  export const User: FC<IconProps>;
  export const LogOut: FC<IconProps>;
  export const Send: FC<IconProps>;
  export const Eye: FC<IconProps>;
  export const EyeOff: FC<IconProps>;
  export const ChevronRight: FC<IconProps>;
  export const ChevronDown: FC<IconProps>;
  export const Check: FC<IconProps>;
  export const X: FC<IconProps>;
  export const Filter: FC<IconProps>;
  export const Search: FC<IconProps>;
  export const Shield: FC<IconProps>;
  export const HardDrive: FC<IconProps>;
  export const Terminal: FC<IconProps>;
  export const Layers: FC<IconProps>;
  export const Hash: FC<IconProps>;
  export const Radio: FC<IconProps>;
  export const Wifi: FC<IconProps>;
  export const WifiOff: FC<IconProps>;
  export const AlertCircle: FC<IconProps>;
  export const ArrowLeft: FC<IconProps>;
  export const BarChart3: FC<IconProps>;
  export const TrendingUp: FC<IconProps>;
  export const Volume2: FC<IconProps>;
  export const VolumeX: FC<IconProps>;
  export const Key: FC<IconProps>;
  export const Copy: FC<IconProps>;
  export const CheckCheck: FC<IconProps>;
  export const HelpCircle: FC<IconProps>;
  export const Info: FC<IconProps>;
}

declare module "framer-motion" {
  export const motion: any;
  export const AnimatePresence: any;
}

declare module "recharts" {
  export const ResponsiveContainer: any;
  export const AreaChart: any;
  export const Area: any;
  export const XAxis: any;
  export const YAxis: any;
  export const Tooltip: any;
  export const CartesianGrid: any;
  export const LineChart: any;
  export const Line: any;
  export const BarChart: any;
  export const Bar: any;
}

declare module "three" {
  export const Mesh: any;
  export const BoxGeometry: any;
  export const MeshStandardMaterial: any;
  export const Group: any;
  export const Vector3: any;
  export const Color: any;
  const Three: any;
  export default Three;
}

declare module "@react-three/fiber" {
  export const Canvas: any;
  export function useFrame(callback: (state: any, delta: number) => void): void;
  export function useThree(): any;
}

declare module "@react-three/drei" {
  export const OrbitControls: any;
  export const Sphere: any;
  export const MeshDistortMaterial: any;
  export const Float: any;
  export const Html: any;
  export const Text: any;
}

declare module "canvas-confetti" {
  export default function confetti(options?: any): Promise<null>;
}
