import "./app.css";

import { Pipeline } from "./pipe";

export function App() {
    return <div className="sp-app">
        <Pipeline />
        <p style="margin-top: 1em; padding: .5em 1em;">
            <b>StringPipe</b> is a zero-install, web-based playground for converting, analyzing, and hashing texts and bytes.<br/>
            Note that StringPipe is still in development. Some features (such as hash functions) may not have been implemented yet.<br/><br/>
            Check out the source code on <a href="https://github.com/fifteen-kr/StringPipe" target="_blank">GitHub</a>.
        </p>
    </div>;
}

export function Root() {
    return <App />;
}
