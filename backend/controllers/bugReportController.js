require('dotenv').config(); // if not already at the top

async function reportBug(req, res) {
    const { title, description, page, userAgent, console: consoleLogs } = req.body;

    const logsMarkdown = (consoleLogs || [])
        .map(c => `[${c.time}] ${c.method.toUpperCase()}: ${c.message}`)
        .join("\n");

    try {
        const response = await fetch(
            "https://api.github.com/repos/xan-d/PlantPartner/issues",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Accept": "application/vnd.github+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title || "No title provided",
                    body: `Page: ${page}
User Agent: ${userAgent}

Description:
${description}

Console Logs:
${logsMarkdown}`,
                    labels: ["user-generated"]  // GitHub label
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("GitHub API error:", data);
            return res.status(response.status).json({ error: data.message });
        }

        console.log("GitHub issue created:", data.html_url);
        console.log("Labels applied:", data.labels.map(l => l.name));

        res.json({ success: true, issueUrl: data.html_url });
    } catch (err) {
        console.error("Bug report error:", err);
        res.status(500).json({ error: "Failed to create GitHub issue" });
    }
}

module.exports = { reportBug };