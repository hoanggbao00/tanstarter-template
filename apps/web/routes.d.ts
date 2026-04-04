declare global {
  type AppRoutes = keyof import('@/routeTree.gen').FileRoutesByTo;
}

export {};
