import { useRouteError } from "@remix-run/react";

export function ErrorBoundary() {
    const error = useRouteError();

    console.error(error);

    return <div>Something went wrong</div>;
}
