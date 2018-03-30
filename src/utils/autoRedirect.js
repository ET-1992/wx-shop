import { tabBar } from '!json-loader!app.json'; // eslint-ignore

// const tabBarUrls = ['pages/home/home', 'pages/news/news', 'pages/calendar/calendar', 'pages/my/my'];

const tabBarUrls = tabBar.list.map(({ pagePath }) => pagePath);

console.log(tabBarUrls);


export default ({ url, type }) => {
	let isTabBar = false;
	let redirectUrl = url || '/pages/home/home';
	for (const tabBarUrl of tabBarUrls) {
		if (redirectUrl.indexOf(tabBarUrl) >= 0) {
			isTabBar = true;
			break;
		}
	}
	const gotoMethod = type === 'navigate' ? wx.navigateTo : wx.redirectTo;
	const autoRedirectMethod = isTabBar ? wx.switchTab : gotoMethod;
	autoRedirectMethod({ url: redirectUrl });
};
