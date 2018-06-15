export default async () => {
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];
	const { onLoad } = currentPage;
	console.log(currentPage, 'currentPage');
	if (onLoad) {
		await onLoad();
	}
};
