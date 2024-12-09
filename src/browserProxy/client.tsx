//client side
import { ACTION } from './defines'

const browserApi = new Proxy(
	{},
	{
		get(_, api) {
			return new Proxy(
				{},
				{
					get(_, method) {
						return (...args: any) => {
							console.log('browser api call:', api, method, args);
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
									console.log('browser event call:', api, event, method);
									if (method === 'addListener') {
										return (callback: () => void) => {
											const callbackList = eventListeners.get(JSON.stringify([api, event]));
											if (!callbackList) {
												eventListeners.set(JSON.stringify([api, event]), [callback]);
												browser.runtime.sendMessage({
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
													browser.runtime.sendMessage({
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
	if (action === ACTION.BROWSER_EVENT_CALLBACK) {
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

function client_install() {
	browser.runtime.onMessage.addListener(handleMessage);
}
function client_uninstall() {
	browser.runtime.sendMessage({
		action: ACTION.BROWSER_EVENT_CLEAR,
	});
	browser.runtime.onMessage.removeListener(handleMessage);
}
export { browserApi , browserEvent, client_install,client_uninstall };