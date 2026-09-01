// Global Ambient Declarations for Offline IDE Support

declare module "react" {
  export type ReactNode = any;
  export type ReactElement<P = any, T extends string | any = any> = any;
  export type ComponentType<P = any> = any;
  export type FC<P = {}> = (props: P) => any;
  export type Key = string | number | bigint;
  export type CSSProperties = { [key: string]: any };
  export type Ref<T = any> = any;
  export type RefObject<T = any> = { current: T | null };
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Dispatch<A> = (value: A) => void;

  export interface ChangeEvent<T = any> {
    target: T & { value: string; checked?: boolean };
    currentTarget: T & { value: string; checked?: boolean };
    preventDefault(): void;
    stopPropagation(): void;
  }

  export interface MouseEvent<T = any> {
    preventDefault(): void;
    stopPropagation(): void;
  }

  export interface FormEvent<T = any> {
    preventDefault(): void;
    stopPropagation(): void;
  }

  export function useState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>];
  export function useState<T = undefined>(): [T | undefined, Dispatch<SetStateAction<T | undefined>>];
  export function useEffect(effect: () => void | (() => void | undefined), deps?: readonly any[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useRef<T = undefined>(): { current: T | undefined };
  export function createContext<T>(defaultValue: T): any;
  export function useContext<T>(context: any): T;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => any): (props: P & { ref?: any; key?: Key }) => any;
  export function createElement(type: any, props?: any, ...children: any[]): any;
  export const Fragment: any;
  export const Suspense: any;

  export namespace JSX {
    interface Element {
      [key: string]: any;
    }
    interface ElementClass {
      render(): any;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface IntrinsicAttributes {
      key?: string | number | bigint | null | undefined;
      [key: string]: any;
    }
  }

  const React: any;
  export default React;
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module "react/jsx-dev-runtime" {
  export const jsxDEV: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface Element {
    [key: string]: any;
  }
  interface ElementClass {
    render(): any;
  }
  interface ElementAttributesProperty {
    props: {};
  }
  interface ElementChildrenAttribute {
    children: {};
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface IntrinsicAttributes {
    key?: string | number | bigint | null | undefined;
    [key: string]: any;
  }
}

declare module "next/link" {
  export interface LinkProps {
    href: string;
    children?: any;
    className?: string;
    target?: string;
    rel?: string;
    onClick?: (e: any) => void;
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
  export function useParams(): Record<string, string | string[]>;
}

declare module "next/image" {
  export default function Image(props: any): any;
}

declare module "lucide-react" {
  export const Shield: any;
  export const ShieldCheck: any;
  export const ShieldAlert: any;
  export const RefreshCw: any;
  export const Cpu: any;
  export const Database: any;
  export const Activity: any;
  export const Zap: any;
  export const Lock: any;
  export const CheckCircle: any;
  export const CheckCircle2: any;
  export const AlertTriangle: any;
  export const AlertOctagon: any;
  export const ArrowRight: any;
  export const ArrowLeft: any;
  export const Play: any;
  export const Pause: any;
  export const RotateCcw: any;
  export const Terminal: any;
  export const Server: any;
  export const Layers: any;
  export const BarChart3: any;
  export const Eye: any;
  export const Key: any;
  export const Search: any;
  export const Sliders: any;
  export const SlidersHorizontal: any;
  export const Wifi: any;
  export const WifiOff: any;
  export const Sparkles: any;
  export const Compass: any;
  export const Clock: any;
  export const Users: any;
  export const FileText: any;
  export const ExternalLink: any;
  export const Award: any;
  export const ChevronRight: any;
  export const ChevronLeft: any;
  export const ChevronDown: any;
  export const ChevronUp: any;
  export const HelpCircle: any;
  export const Info: any;
  export const Globe: any;
  export const Check: any;
  export const X: any;
  export const Copy: any;
  export const Download: any;
  export const Upload: any;
  export const PlayCircle: any;
  export const AlertCircle: any;
  export const LogOut: any;
  export const GraduationCap: any;
  export const FileCode: any;
  export const Send: any;
  export const Code: any;
  export const UserCheck: any;
  export const LogIn: any;
  export const Menu: any;
}

declare module "framer-motion" {
  export const motion: any;
  export const AnimatePresence: any;
  export function useAnimation(): any;
  export function useMotionValue(initial: any): any;
  export function useTransform(...args: any[]): any;
  export function useSpring(...args: any[]): any;
}

declare module "recharts" {
  export const ResponsiveContainer: any;
  export const AreaChart: any;
  export const Area: any;
  export const LineChart: any;
  export const Line: any;
  export const BarChart: any;
  export const Bar: any;
  export const XAxis: any;
  export const YAxis: any;
  export const CartesianGrid: any;
  export const Tooltip: any;
  export const Legend: any;
  export const PieChart: any;
  export const Pie: any;
  export const Cell: any;
  export const RadarChart: any;
  export const Radar: any;
  export const PolarGrid: any;
  export const PolarAngleAxis: any;
  export const PolarRadiusAxis: any;
}

declare module "clsx" {
  export type ClassValue = any;
  export default function clsx(...inputs: ClassValue[]): string;
}

declare module "tailwind-merge" {
  export function twMerge(...inputs: any[]): string;
}

declare module "canvas-confetti" {
  export default function confetti(options?: any): Promise<null>;
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
