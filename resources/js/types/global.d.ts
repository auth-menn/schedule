import 'ziggy-js';
import type { FC } from 'react';

declare module '@/Layouts/*' {
  const component: React.ComponentType<any>;
  export default component;
}

declare module '@/Components/*' {
  const component: React.ComponentType<any>;
  export default component;
}

declare global {
    const route: import('ziggy-js').route;
}

export {};