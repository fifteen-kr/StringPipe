import "./app.css";

import { Pipeline } from "./pipe";

export function App() {
    return <div className="sp-app">
        <Pipeline />
        <p style="margin-top: 1em; padding: .5em 1em;">
            StringPipe is an easy-to-use tool, supporting both desktop and mobile, for processing strings and bytes in a type-safe manner.<br/>
            StringPipe is currently work-in-progress, and many features are planned.
        </p>
    </div>;
}

export function Root() {
    return <App />;
}