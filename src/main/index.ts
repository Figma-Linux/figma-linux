import appInit from "./App";

// Catch unhandling unexpected exceptions
process.on('uncaughtException', (error: Error) => {
	console.error(`uncaughtException: `, error);
    process.exit(1)
});

// Catch unhandling rejected promises
process.on('unhandledRejection', (reason: any) => {
	console.error(`unhandledRejection: `, reason);
    process.exit(1)
});

appInit();
