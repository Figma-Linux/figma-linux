import { exec } from 'child_process';

export const cmd = (command: string): Promise<string> => new Promise((res, rej)  => {
	exec(command, (err, stdout, stderr) => {
		console.log(`exec ${command} error: `, err);
		console.log(`exec ${command} stderr: `, stderr);

		if (err) rej(err);

		res(stdout);
	});
});

