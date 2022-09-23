console.log("这是content script!")

const getStrItem = (obj) => {
  const {
    user_name,
    avatar_large,
    user_id
  } = obj

  return `
  <a
    href="https://juejin.cn/user/${user_id}"
    target="_blank"
    rel="nofollow noopener noreferrer"
    style="display: flex; align-items: center; font-size: 1.25rem; color: #000; margin-bottom: 0.8rem;"
  >
    <img src="${avatar_large}" alt="" style="width: 45px; height: 45px; border-radius: 50%; margin-right: 1.2rem; object-fit: cover;" />
    <span style="margin: 0 0.3em; font-weight: 500">${user_name}</span>
  </a>
  `
}

const getStrHeader = (userlistLength) => {
  return `
  <div style="position: absolute; right: -247px; flex: 0 0 auto; margin-left: 1rem; width: 20rem; line-height: 1.2">
    <div style="position: fixed; top: 6.766999999999999rem; width: 20rem; transition: all 0.2s">
      <div id="karla" style="margin-bottom: 1rem; background-color: #fff; border-radius: 2px; max-height: calc(100vh - 90px); overflow-y: auto">
        <div style="padding: 1.333rem; font-size: 1.333rem; font-weight: 600; color: #31445b; border-bottom: 1px solid rgba(230, 230, 231, 0.5)">特别关注 - ${userlistLength}</div>
        <div style="padding: 1.333rem">
  `
}

const getStrFooter = () => {
  return `
  </div>
</div>
</div>
</div>
  `
}

const getStrCenter = (str) => {
  if (!str.trim()) {
    return `
    <div style="text-align:center; font-size: 1.25rem; color: #000; margin-bottom: 1rem;">
    <span>暂无特别关注，快去添加吧！</span>
  </div>
    `
  } else {
    return str
  }
}

const getUserList = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('userlist', (arg) => {
      resolve(arg.hasOwnProperty('userlist') ? arg.userlist : [])
    })
  })
}

const addEle = (str) => {
  const stickWrap = document.querySelector('.main-container')
  //insertAdjacentHTML()方法,指 Element将指定的文本解析为 HTML 或 XML，并将生成的节点插入到 DOM 树中的指定位置。
  /**
   * "beforebegin"：在元素之前。仅当元素在 DOM 树中并且具有父元素时才有效。
   * "afterbegin"： 就在元素内部，在它的第一个孩子之前。
   * "beforeend"： 就在元素内部，在它的最后一个子元素之后。
   * "afterend"：元素之后。仅当元素在 DOM 树中并且具有父元素时才有效。
   */
  stickWrap.insertAdjacentHTML('beforeEnd', str)
}
const main = () => {
  getUserList().then(res => {
    let strcenter = ``
    res.forEach(item => {
      const stritem = getStrItem(item)
      strcenter += stritem
    })
    const strAll = getStrHeader(res.length) + getStrCenter(strcenter) + getStrFooter()
    addEle(strAll)
  })
}
window.onload = () => {
  setTimeout(() => {
    main()
  }, 1000)
}

/**
 * 清除页面 DOM
 */
const clearDom = () => {
  return new Promise((resolve, reject) => {
    const myPluginEle = document.getElementById('karla')

    if (myPluginEle) {
      myPluginEle.parentNode.removeChild(myPluginEle)
    }
    resolve()
  })
}

/**
 * 监听 background 传来的数据
 */
chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (data.refresh) {
    clearDom().then(() => {
      main()
    }).finally(() => {
      return true
    })
  }
})