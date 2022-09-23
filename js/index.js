// 通信需要 activeTab
const tabUrlList = ['https://juejin.cn/user', 'https://juejin.cn/post']
console.log("进入index.js")
/**
 * 匹配我们当前打开的url, 是否是这两个中的
 */
const  existFunc = (tabUrl) => {
  return tabUrlList.filter(url => tabUrl.includes(url)).length
}

window.onload = () => {
  console.log("onload!!!!!")
  const karlaInput = document.getElementById('karlaInput')
  const karlaBtnCancel = document.getElementById('karlaBtnCancel')
  const karlaBtnConfirm = document.getElementById('karlaBtnConfirm')

  let tabId
  let tabUrl

  chrome.tabs.getSelected(null, function(tab) {
    //先获取当前页面的tabId
    tabId = tab.id
    tabUrl = tab.url
  })

  karlaBtnCancel.onclick = function () {
    karlaInput.value = ''
  }

  karlaBtnConfirm.onclick = function () {
    if(existFunc(tabUrl)) {

      //发送消息给 background
      chrome.runtime.sendMessage({
        user_id: karlaInput.value,
        tabId
      }, function(res) {
        karlaInput.value = ''
      })
    }
  }
}