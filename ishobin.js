
const bezier = require('./bezier-easing')
const base = 10; // min

const times = 15
Array.from({ length: times }).reduce((b, c, i) => {
//   const increase = bezier(.61,.13,.74,.25)((i + 1)  / 5);
  const increase = bezier(.78,.18,.71,.32)((i + 1)  / 5);
  b = b * (1 + increase);
  console.log(`No.${i+1}`, dd(b), increase);
  return b;
}, base);

function easeInCubic(t) {
  return t * t;
}

function dd(peroid){
    if(peroid < 60) return parseInt(peroid) + 'm';
    if(peroid < 24 * 60) return parseInt(peroid / 60) + 'h';
    if(peroid < 30 * 24 * 60) return parseInt(peroid / (24 * 60)) + 'd';
    if(peroid < 12 * 30 * 24 * 60) return parseInt(peroid / (30 * 24 * 60)) + 'M';
    return parseInt(peroid / (12 * 30 * 24 * 60)) + 'Y'; 
}
// console.log(bezier(0.6, 0.04, 0.98, 0.335)(1))
// console.log(bezier(0.6, 0.04, 0.98, 0.335)(0.1))
// console.log(bezier(0.6, 0.04, 0.98, 0.335)(1))


// 分级: 分成Lv13
// 选项有[A没记住/B需巩固/C记住了/D跳级]
// A 小于1小时往下走 大于1小时回到(1小时)级
// B 小于半天~1天都往下走 大于半天~1天回到(半天~1天)级
// C 继续往下走
// D 随便到哪级


// 单词卡属性
// 预设属性(正面/反面/图片) + 自定义属性(详细/图片/音频) + 多标签
// 属性类型 有 图片/语音/文本
// todo: 
// 1. 点击自动从google获取图片、中文翻译
// 2. 接入google文字转语音


// schedule

// 统计
// 日统计/周统计/月统计/年统计


// study学习 多种模式
// todo
// 基础模式 选项：可以多选展示属性(默认展示正面)

// review复习 多种模式
// todo
// 读 给出分级选项 可以配置展示哪些信息(默认展示英文)
// 写 拼写判断对错 可以配置展示哪些信息(默认展示中文)
// 回忆 拼写判断对错 可以配置展示哪些信息(默认展示图片)
// 概念关联网的东西