//client side
import { ACTION } from './defines'
var port:browser.runtime.Port;
const browserApi = new Proxy(
	{},
	{
		get(_, api) {
			return new Proxy(
				{},
				{
					get(_, method) {
						return (...args: any) => {
							console.log('browser api call:', api, method, args, 'on port:', port);
							return browser.runtime.sendMessage({ //because require promise return
								action: ACTION.BROWSER_API,
								api: api,
								method: method,
								args,
							});
						};
					},
				}
			);
		},
	}
);

const eventListeners = new Map();
const browserEvent = new Proxy(
	{},
	{
		get(_, api) {
			return new Proxy(
				{},
				{
					get(_, event) {
						return new Proxy(
							{},
							{
								get(_, method) {
									console.log('browser event call:', api, event, method, 'on port:', port);
									if (method === 'addListener') {
										return (callback: () => void) => {
											eventListeners.set(`${api.toString()}.${event.toString()}`, callback);
											port.postMessage({
												action: ACTION.BROWSER_EVENT,
												api: api,
												event: event,
											});
										}
									}
									else {
										console.error('Method not supported:', method);
									}
								}
							}
						)
					},
				}
			);
		},
	}
);

function handleMessage(message: any) {
	const { action, ...rest } = message;
	if (action === ACTION.BROWSER_EVENT) {
		const { api, event, args } = rest;
		console.log('browser event callback:', api, event, args)
		const callback = eventListeners.get(`${api.toString()}.${event.toString()}`);
		if (callback) {
			callback(...args);
		} else {
			console.error('No callback found for:', api, event);
		}
	}

}

function client_install(portName: string) {
	port = browser.runtime.connect({ name: portName });
	port.onMessage.addListener(handleMessage);
	console.log('connected to port:', port);
}

export { browserApi , browserEvent, client_install };