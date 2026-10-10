//完成的列表
const finishList = [
    { id: 1, number: '12726564745', message: '卡通红包压岁钱红包', status: '进行中', price: 19.9, time: '02-04' },
    { id: 2, number: '13445323445', message: '西湖龙井花茶精装版', status: '进行中', price: 699.9, time: '02-04' },
    { id: 3, number: '13665474988', message: '红酒醇香版', status: '进行中', price: 59.9, time: '01-09' },
    { id: 4, number: '13673647848', message: '金华火腿礼盒装', status: '进行中', price: '99.9', time: '01-22' }
]
//进行中列表
const unfinishedList = [
    { id: 1, number: '16673653533', message: '烟台苹果盒装大果', status: '已完成', price: 29.9, time: '12-04' },
    { id: 2, number: '13836446477', message: '大泽山葡萄冷链', status: '已完成', price: 48.8, time: '09-12' },
    { id: 3, number: '19371122366', message: '沧州金丝小枣补血益气', status: '已完成', price: 66.6, time: '08-18' }
]
export  { finishList,unfinishedList as goingList};//导出数据