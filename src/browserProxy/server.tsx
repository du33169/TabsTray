
//server side
import { ACTION } from './defines'
function get_api(api: string, item: string):any {
	if (browser.hasOwnProperty(api) && browser[api as keyof typeof browser].hasOwnProperty(item)) {
		const apiObj=browser[api as keyof typeof browser];
		return apiObj[item as keyof typeof apiObj];
	} else {
		console.error(`API ${api} or item ${item} not found`);
	}
}
async function handle_api(api: string, method: string, args: any[]) {
	console.log(`Calling browser API ${api}.${method} with args: `, args);
	const handle=get_api(api,method);
	if (handle) {
		try {
			const result = await handle(...args);
			return Promise.resolve(result); // Send back the result
		} catch (error:any) {
			return Promise.reject(error.message);
		}
	} else {
		return Promise.reject(`Method ${method} not found`);
	}
}

class PersistentListenerManager {
	// data structure: a object with tabId as key and an array as value, storing all events registered for that tab
	// each element in the array is an object with api and event as keys
	private tabEvents: { [tabId: number]: { api: string, event: string }[] } = {};
	private loaded = false;
	listener_factory(api: string, event: string) {
		return async (...args: any[]) => {
			console.log(`Received browser event ${api}.${event} with args: `, args);
			if(!this.loaded) await this.load();
			Object.entries(this.tabEvents).forEach(([tabId, eventList]) => {
				if (eventList.some(item => item.api === api && item.event === event)) {
					console.log(`Sending browser event ${api}.${event} to tab ${tabId}`);
					browser.tabs.sendMessage(Number(tabId), {
						action: ACTION.BROWSER_EVENT_CALLBACK,
						api,
						event,
						args,
					});
				}
			});
		}
	}
	constructor(eventList:{ api: string, event: string }[]) {
		eventList.forEach(item => {// in manifest 3, only sync eventListeners can persist across non-persistent background pages
			const listener = this.listener_factory(item.api, item.event);
			get_api(item.api, item.event).addListener(listener);
		});
		if(!this.loaded)this.load();
	}
	save() {
		//save eventList to storage 
		browser.storage.session.set({ tabEvents: this.tabEvents }).then(() => {
			console.log(`Saved tabEvents to storage session: `, this.tabEvents);
		});
		
	}
	async load() {
		//load eventList from storage 
		return browser.storage.session.get('tabEvents').then(result => {
			if (result.tabEvents) {
				this.tabEvents = result.tabEvents;
			}
		}).then(() => {
			console.log(`LoadedtabEvents from storage session: `, this.tabEvents);
			this.loaded = true;
		});
		
	}

	register(tabId : number,api: string, event: string) {
		//check if event already exists
		if (!this.tabEvents.hasOwnProperty(tabId)) {
			this.tabEvents[tabId] = [];			
		}
		const eventList = this.tabEvents[tabId];
		const index = eventList.findIndex(item => item.api === api && item.event === event);
		if (index !== -1) {
			console.log(`Event ${api}.${event} already registered for tab ${tabId}`);
			return;
		} else { //event not exists, register it
			eventList.push({ api, event });
		}
		this.save();
	}
	unregister(tabId: number, api: string, event: string) {
		if (!this.tabEvents.hasOwnProperty(tabId)) {
			console.error(`No event registered for tab ${tabId}`);
			return;
		}
		const eventList = this.tabEvents[tabId];
		const index = eventList.findIndex(item => item.api === api && item.event === event);
		if (index === -1) {
			console.error(`Event ${api}.${event} not registered for tab ${tabId}`);
			return;
		} else { //event exists, unregister it
			eventList.splice(index, 1);
		}
		this.save();
	}
	unregister_tab(tabId: number) {
		if (!this.tabEvents.hasOwnProperty(tabId)) {
			console.error(`No event registered for tab ${tabId}`);
			return;
		}
		delete this.tabEvents[tabId];
		this.save();
	}
}


async function handle_event(listenerMgr: PersistentListenerManager, tabId: number, api: string, event: string, action: string) {
	
	if (action === ACTION.BROWSER_EVENT_ADD) {
		console.log(`Registering browser event ${api}.${event} from tab ${tabId}`);
		listenerMgr.register(tabId, api, event);
	} else if (action === ACTION.BROWSER_EVENT_REMOVE) {
		console.log(`Unregistering browser event ${api}.${event} from tab ${tabId}`);
		listenerMgr.unregister(tabId, api, event);
	} else {
		console.error(`Unknown action ${action}`);
	}
}
function handle_message_factory(listenerMgr: PersistentListenerManager) {
	return async function handle_message(message: any, sender: browser.runtime.MessageSender, sendResponse: (response: any) => void): Promise<any> {
		const { action, ...rest } = message;
		console.log(`Received message from content script: `, message);
		if (action === ACTION.BROWSER_API) {
			const { api, method, args } = rest;
			return handle_api(api, method, args);
		} else if (action === ACTION.BROWSER_EVENT_ADD || action === ACTION.BROWSER_EVENT_REMOVE) {
			const { api, event } = rest;
			return handle_event(listenerMgr,sender.tab!.id!, api, event, action);
		} else if (action === ACTION.BROWSER_EVENT_CLEAR) {
			listenerMgr.unregister_tab(sender.tab!.id!);
		} else {
			console.error(`Unknown action ${action}`);
		}
	}
}

function server_install(eventList: { api: string, event: string }[]) {
	const listenerMgr = new PersistentListenerManager(eventList);
	browser.runtime.onMessage.addListener(handle_message_factory(listenerMgr));
}

export { server_install };