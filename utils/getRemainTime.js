// import { padStart } from 'lodash';

export default (timeLimit) => {
    let remainSeconds = timeLimit;

    const hour = Math.floor(remainSeconds / (60 * 60));
    remainSeconds = remainSeconds % (60 * 60);
    const minute = Math.floor(remainSeconds / 60);
    const second = remainSeconds % 60;

    // return {
    // 	hour: padStart(hour, 2, 0),
    // 	minute: padStart(minute, 2, 0),
    // 	second: padStart(second, 2, 0),
    // };
    return [
        String(hour).padStart(2, 0), String(minute).padStart(2, 0), String(second).padStart(2, 0)
    ];
};
