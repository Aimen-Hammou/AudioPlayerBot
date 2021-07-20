const fs = require('fs')
const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client()
const chokidar = require('chokidar')

const watcher = chokidar.watch('./audios', {
  ignored: /^\./,
  ignoreInitial: true,
  persistent: true,
  awaitWriteFinish: true
})

function check() {
  const fileListed = []
  fs.readdirSync('./audios').forEach((file) => {
    if (
      file.includes('.mp3') ||
      file.includes('.m4a') ||
      file.includes('.ogg')
    ) {
      fileListed[file.split('.')[0]] = file
    }
  })
  return fileListed
}

let fileList = check()

watcher.on('add', function (path) {
  fileList = check()
  console.log('fileList has been updated with ' + path)
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', async (msg) => {
  if (msg.author === client.user) {
    return
  }

  if (msg.content === 'help') {
    let msgOut = 'Comandi disponibili: \n'
    for (const key in fileList) {
      msgOut += key + '\n'
    }
    msg.channel.send(msgOut)
  }

  if (msg.content === 'testtutto') {
    let msgOut = 'Comandi disponibili: \n'
    for (const key in fileList) {
      msgOut += key + ' '
    }
    msg.channel.send(msgOut)
  }

  const split = msg.content.split(' ')

  for (let index = 0; index < split.length; index++) {
    const item = split[index]
    await new Promise(async (resolve) => {
      if (fileList[item] !== undefined) {
        const connection = await msg.member.voice.channel.join()
        const dispatcher = connection.play(
          require('path').join(__dirname, '/audios/' + fileList[item])
        )
        dispatcher.on('finish', async () => {
          dispatcher.destroy()
          if (index === split.length - 1) {
            connection.disconnect()
          }
          resolve()
        })
      }
    })
  }
})

client.login(config.TOKEN)
