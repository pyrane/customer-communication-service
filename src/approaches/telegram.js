/**
 * * * * * * * * * NOTICE! * * * * * * * * * *
 * THE TG BOT SHOULD NOLY BE SINGLE INTANCE 
 * TO POLLING DATA, TO AVOID THIS 
 * RESTRICTION, SET A WEBHOOK IN CONFIG INSTEAD 
 * * * * * * * * * * * * * * * * * * * * * * *
 */

const log = require('../logging')
const TelegramBot = require('node-telegram-bot-api')
const config = require('../config')

// Config
const tgAuth = {
  name: config.telegramServer.bot.username,
  token: config.telegramServer.bot.token,
  webhook: config.telegramServer.bot.webhook
}

const options = { polling: tgAuth.webhook ? false : true }
const bot = new TelegramBot(tgAuth.token, options)

log.trace('telegram bot created', { tgAuth, options })

module.exports.getBotUserName = () => tgAuth.name

// Mode:  'Markdown' | 'MarkdownV2' | 'HTML'
module.exports.sentMsg = async (chatId, content, mode) => {
  mode = mode || "Markdown"

  log.trace('tg sending message, chatId: %s content: %s mode: %s', chatId, content, mode)

  let res = await bot.sendMessage(chatId, content, {
    parse_mode: mode
  })

  log.trace('tg message sent', res)

  return res
}

module.exports.generateInvitingLink = (bindingId) => {
  const link = `https://t.me/${tgAuth.name}` + (bindingId ? `?start=${bindingId}` : '')

  log.trace('tg invitation like generated, link: %s', link)

  return link
}

module.exports.onChatStart = (cb) => {
  bot.onText(/\/start/, (msg) => cb(msg))
  log.trace('tg on text message callback set, regex: /start callback: %s', cb)
}

module.exports.handleReqFromWebhook = body => bot.processUpdate(body)
