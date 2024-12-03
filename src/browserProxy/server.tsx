
//server side
import { ACTION } from './defines'

async function handle_api(api: string, method: string, args: any[]) {
	console.log(`Calling browser API ${api}.${method} with args: `,args);
	if (browser[api] && typeof browser[api][method] === 'function') {
		try {
			const result = await browser[api][method](...args);
			return Promise.resolve(result); // Send back the result
		} catch (error:any) {
			return Promise.reject(error.message);
		}
	} else {
		return Promise.reject(`Method ${method} not found`);
	}
}

async function handle_event(port:browser.runtime.Port, api: string, event: string, action: string) {
	console.log(`Registering browser event ${api}.${event}`);
	if (browser[api] && browser[api][event]) {
		const listener = (...args) => {
			port.postMessage({
				action: ACTION.BROWSER_EVENT_ADD,
				api,
				event,
				args,
			});
		}
		if (action === ACTION.BROWSER_EVENT_ADD) {
			browser[api][event].addListener(listener);
		} else if (action === ACTION.BROWSER_EVENT_REMOVE) {
			browser[api][event].removeListener(listener);
		} else {
			console.error(`Unknown action ${action}`);
		}
	} else {
		console.error(`Event ${event} not found`);
	}
}
function handle_message_factory(port: browser.runtime.Port) {
	return async function handle_message(message: any) {
		const { action, ...rest } = message;
		console.log(`Received message from content script: `,message);
		if (action === ACTION.BROWSER_API) {
			const { api, method, args } = rest;
			return handle_api(api, method, args);
		} else if (action === ACTION.BROWSER_EVENT_ADD || action === ACTION.BROWSER_EVENT_REMOVE) {
			const { api, event } = rest;
			return handle_event(port,api, event, action);
		} else {
			console.error(`Unknown action ${action}`);
		}
	}
}

function handle_connect(port:browser.runtime.Port) {
	console.log(`Connected to content script on port ${port.name}`);
	const message_handler = handle_message_factory(port);
	port.onMessage.addListener(message_handler);
	browser.runtime.onMessage.addListener(message_handler);
	port.onDisconnect.addListener(() => {
		console.log(`Disconnected from content script on port ${port.name}`);
		browser.runtime.onMessage.removeListener(message_handler);
	});

}


function server_install() {
	browser.runtime.onConnect.addListener(handle_connect);
}

export { server_install };