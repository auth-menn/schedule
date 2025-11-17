import '@inertiajs/react';

declare module '@inertiajs/core' {
  interface PageProps {
    auth: {
      user: {
        id: number;
        name: string;
        email: string;
        role: 'admin' | 'user';
      };
    };
  }
}
