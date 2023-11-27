import run from "./app/server/app";
import config from "./config";

run(Number(config.serverPort));
