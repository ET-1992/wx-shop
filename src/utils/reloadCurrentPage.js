export default async () => {
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];
	const { reLoad } = currentPage;
	if (reLoad) {
		await reLoad();
	}
};
