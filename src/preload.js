const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

// 更新消息
ipcRenderer.on('electron-updater-message', function (event, text) {
  const electronUpdaterMessage = document.getElementById('electron-updater-message')
  electronUpdaterMessage.innerHTML = text
})
