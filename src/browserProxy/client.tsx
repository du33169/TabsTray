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

// JSON.stringify<api,event> => callback[]
const eventListeners = new Map<string,Array<() => void>>();
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
											const callbackList = eventListeners.get(JSON.stringify([api, event]));
											if (!callbackList) {
												eventListeners.set(JSON.stringify([api, event]), [callback]);
												port.postMessage({
													action: ACTION.BROWSER_EVENT_ADD,
													api: api,
													event: event,
												});
											} else {//already registered
												callbackList.push(callback);
											}
											console.log('saved callbacks:', eventListeners);
										}
									}
									else if (method ==='removeListener') {
										return (callback: () => void) => {
											const callbackList = eventListeners.get(JSON.stringify([api, event]));
											if (callbackList) {
												const index = callbackList.indexOf(callback);
												if (index >= 0) {
													callbackList.splice(index, 1);
												} else {// all clear
													port.postMessage({
														action: ACTION.BROWSER_EVENT_REMOVE,
														api: api,
														event: event,
													});
												}
											} else {
												console.error('No callback found for:', api, event, callback);
											}
											console.log('saved callbacks:', eventListeners);
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
	if (action === ACTION.BROWSER_EVENT_ADD) {
		const { api, event, args } = rest;
		console.log('browser event callback:', api, event, args)
		const callbackList = eventListeners.get(JSON.stringify([api, event]));
		console.log(eventListeners, 'saved callbacks:', callbackList);
		if (callbackList) {
			callbackList.forEach((callback: (...args: any) => void) => {
				callback(...args);
			});
		} else {
			console.error('No callback found for:', api, event);
		}
	}

}

function client_install(portName: string) {
	port = browser.runtime.connect({ name: portName });
	port.onMessage.addListener(handleMessage);
	console.log('connected to port:', port);
	port.onDisconnect.addListener(() => {
		eventListeners.forEach((callbackList, tuple) => {
			const [api, event] = JSON.parse(tuple);
			port.postMessage({
				action: ACTION.BROWSER_EVENT_REMOVE,
				api,
				event,
			});
		});
		eventListeners.clear();
		console.log('disconnected from port:', port);
	});
	return port;
}

export { browserApi , browserEvent, client_install };