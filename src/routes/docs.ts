import { Router } from "express";

import swaggerSpec from "../docs/swaggerSpec.js";

const router = Router();

const docsHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>API Docs</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css"
    />
    <style>
      body {
        margin: 0;
      }
      #swagger-ui {
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        const specUrl = window.location.origin + "/docs/openapi.json";
        SwaggerUIBundle({
          url: specUrl,
          dom_id: "#swagger-ui",
          presets: [SwaggerUIBundle.presets.apis],
          layout: "BaseLayout",
          deepLinking: true,
        });
      };
    </script>
  </body>
</html>`;

router.get("/openapi.json", (_req, res) => res.json(swaggerSpec));
router.get("/", (_req, res) => res.send(docsHtml));

export default router;
