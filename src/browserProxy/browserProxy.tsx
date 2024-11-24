const browserAgent = new Proxy(
	{},
	{
		get(_, prop) {
			return new Proxy(
				{},
				{
					get(_, method) {
						return (...args) => {
							return browser.runtime.sendMessage({
								namespace: 'browserAgent',
								method: `${prop}.${method}`,
								args,
							});
						};
					},
				}
			);
		},
	}
);


async function handleMessage(message) {
	const { namespace, method, args } = message;

	if (namespace === 'browserAgent') {
		console.log(`Received message from content script: ${method}(${args.join(', ')})`);
		const [object, fn] = method.split('.');

		if (browser[object] && typeof browser[object][fn] === 'function') {
			try {
				const result = await browser[object][fn](...args);
				return Promise.resolve(result); // Send back the result
			} catch (error) {
				return Promise.reject(error.message);
			}
		} else {
			return Promise.reject(`Method ${method} not found`);
		}
	}
}
function background_install() {
	browser.runtime.onMessage.addListener(handleMessage);
}

export { browserAgent, background_install }