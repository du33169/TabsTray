import Markdown from "react-markdown";
import { useEffect, useState } from "react";

export function MarkdownFileLoader({ url }: { url: string }) {
	const [fileContent, setFileContent] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(url)
			.then(response => response.text())
			.then(text => {
				setFileContent(text);
				setLoading(false);
			})
			.catch(error => {
				console.error(error);
				setLoading(false);
			});
	}, [url]);
	return (
		<Markdown>
			{loading ? "loading..." : fileContent}
		</Markdown>
	)
}