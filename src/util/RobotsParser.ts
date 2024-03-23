export default function isRootForbidden(robots: string) {
    const robotsLines = robots.split("\n");

    let isForbidden = false;
    let userAgentAll = false;

    for (let i = 0; i < robotsLines.length; i++) {
        const lineText = robotsLines[i].trim().toLowerCase();
        if (lineText.length == 0) continue;

        let [key, value] = lineText.trim().replace(/\s+/g, " ").split(":");
        if (!key || !value) continue;

        key = key.trim();
        value = value.trim();

        if (key == "user-agent" && value == "*") {
            userAgentAll = true;
            continue;
        }

        if (!userAgentAll) continue;
        if (key == "disallow" && value == "/") {
            isForbidden = true;
            break;
        }
    }

    return isForbidden;
}
