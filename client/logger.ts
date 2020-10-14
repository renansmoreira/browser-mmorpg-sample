export class Logger {
	log(...messages: any[]): void {
		console.log.apply(this, messages);
	}
};

