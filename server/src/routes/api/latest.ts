import { Hono } from "hono";

const covidRoutes = new Hono();

covidRoutes.get("/latest", (c) => {
  return c.json({ message: "Get latest COVID data" });
});

covidRoutes.get("/country/:code", (c) => {
  const code = c.req.param("code");
  return c.json({ message: `Get COVID data for country ${code}` });
});

covidRoutes.get("/stats", (c) => {
  return c.json({ message: "Get COVID statistics" });
});

export default covidRoutes;
