import { Hono } from "hono";

const apiDocsRoute = new Hono();

let mainApp: Hono;

export function initApiDocs(app: Hono) {
  mainApp = app;
}

apiDocsRoute.get("/", (c) => {
  // Use the stored mainApp reference
  const routes = mainApp.routes.map((route) => {
    return {
      method: route.method,
      path: route.path,
    };
  });

  const routeList = routes
    .map((route) => `<li>${route.method}: ${route.path}</li>`)
    .join("");

  const html = `
    <html>
      <head>
        <title>API Endpoints</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
          }
          h1 { color: #333; }
          ul { list-style-type: none; padding: 0; }
          li {
            padding: 0.5rem;
            margin: 0.5rem 0;
            background: #f5f5f5;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <h1>Available API Endpoints</h1>
        <ul>${routeList}</ul>
      </body>
    </html>
  `;

  return c.html(html);
});

export default apiDocsRoute;
