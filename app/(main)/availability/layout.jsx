import { Suspense } from "react";

export default function AvailabilityLayout({children}) {
    return (
        <div className = "mx-auto">
        <Suspense fallback = {<div>加载事件...</div>}>
            {children}
        </Suspense>
        </div>
    );
}