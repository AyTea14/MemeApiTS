import "dotenv/config";
import fastify from "fastify";
import expressPlugin from "@fastify/express";
import { gibmeRoutes, homePage } from "./routes/index.js";
import { removeTrailingSlash } from "#functions";
import { morganMiddleware } from "#utils";

async function build() {
    const server = fastify({
        ignoreTrailingSlash: true,
        trustProxy: true,
    });

    await server.register(gibmeRoutes, { prefix: "gimme" });
    await server.register(expressPlugin);
    server.addHook("preHandler", removeTrailingSlash);

    server.use(morganMiddleware);
    return server;
}

const PORT = parseInt(process.env.PORT as string) || 3000;
build()
    .then((server) => {
        server.get("/", homePage);
        server.listen({ port: PORT, host: "0.0.0.0" }, (_err, address) => {
            console.log(`application listening at ${address}`);
        });
    })
    .catch(console.log);
