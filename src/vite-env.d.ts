/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URI: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module "react-big-calendar/lib/TimeGrid" {
    import { ComponentType } from "react";
    const TimeGrid: ComponentType<any>;
    export default TimeGrid;
}
