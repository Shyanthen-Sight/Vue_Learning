// 导出模块
// 私有变量
// 甘蔗信息组
const list = [
    {id:'1',place:'台湾' , stock : 22, sweet:'5%',sales:244},
    {id:'2',place:'福建' , stock : 42, sweet:'1%',sales:233},
    {id:'3',place:'广东' , stock : 12, sweet:'3%',sales:788},
    {id:'4',place:'海南' , stock : 33, sweet:'4%',sales:955},
    {id:'5',place:'广西' , stock : 12, sweet:'3%',sales:877}
];
// 默认值
const pageName="module";//本模块默认值
// 私有方法
function description(){
    return "甘蔗是很好的生果，能够润肠通便、进步造血功用、增强免疫力、清热避暑、助消化";
}

// 尾部导出
export default pageName;//导出默认值
export {list,description  as advantage };//导出私有变量，对私有方法进行重命名
