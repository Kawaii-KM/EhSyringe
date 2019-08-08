import './popup.less';
import { chromeMessage } from '../tool/chrome-message';
const updateButton = document.querySelector('#updateButton') as HTMLButtonElement;

const sha = document.querySelector('#sha') as HTMLButtonElement;
const updateTime = document.querySelector('#updateTime') as HTMLButtonElement;
const checkVersionElement = document.querySelector('#checkVersion') as HTMLButtonElement;






function dateDiff(hisTime: Date,nowTime?: Date){
  if(!arguments.length) return '';
  let arg = arguments,
    now =arg[1]?arg[1]:new Date().getTime(),
    diffValue = now - arg[0],
    result='',

    minute = 1000 * 60,
    hour = minute * 60,
    day = hour * 24,
    halfamonth = day * 15,
    month = day * 30,
    year = month * 12,

    _year = diffValue/year,
    _month = diffValue/month,
    _week = diffValue/(7*day),
    _day = diffValue/day,
    _hour = diffValue/hour,
    _min = diffValue/minute;

  if(_year>=1) result=Math.floor(_year) + "年前";
  else if(_month>=1) result=Math.floor(_month) + "个月前";
  else if(_week>=1) result=Math.floor(_week) + "周前";
  else if(_day>=1) result=Math.floor(_day) +"天前";
  else if(_hour>=1) result=Math.floor(_hour) +"个小时前";
  else if(_min>=1) result=Math.floor(_min) +"分钟前";
  else result="刚刚";
  return result;
}

updateButton.onclick = () => {
  updateButton.disabled = true;
  chromeMessage.send("get-tag-data", {}, () => {
    setTimeout(() => {
      updateButton.disabled = false;
      getVersion();
      checkVersion();
    }, 200)
  })
};

function checkVersion() {
  checkVersionElement.textContent = '检查中...';
  chromeMessage.send("check-version",{}, (data) => {
    console.log(data);
    if(data && data.new){
      const hasNewData = data.new !== data.old;
      checkVersionElement.textContent = hasNewData ? data.new.slice(0,6) + ' 有更新!': '已是最新版本';
      if (hasNewData) {
        checkVersionElement.classList.add('hasNew');
        updateButton.classList.add('primary')
      } else {
        checkVersionElement.classList.remove('hasNew');
        updateButton.classList.remove('primary')
      }
    } else {
      checkVersionElement.textContent = '获取失败';
    }
  });
}

function getVersion() {
  chrome.storage.local.get((data) => {
    sha.textContent = data.sha ? data.sha.slice(0,6) : 'N/A';
    updateTime.textContent = data.updateTime ? dateDiff(data.updateTime) : 'N/A';
    updateTime.title = new Date(data.updateTime).toLocaleString();
  });
}

getVersion();
checkVersion();
