import { Context, Schema, h } from 'koishi'

import { } from 'koishi-plugin-puppeteer'

export const name = 'bilisearch'
export const inject = ['puppeteer']
export const usage = `
<p>指令「b站搜索」。</p>`


export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.command('bilibilisearch <keyword:string>', '搜索b站')
    .alias('b站搜索')
    .action(async ({ session }, keyword) => {

      const elements = h.select(keyword || '','text')
      if (elements.length === 0) 
        return '请输入搜索词'

      const page = await ctx.puppeteer.page()
      await page.setViewport({
        width: 1160,
        height: 1370
      })

      const url = `https://search.bilibili.com/all?keyword=${elements.join('+')}`
      await page.goto(url, {
        waitUntil: 'networkidle2'
      })
      const shooter = page
      let msg: h | string
      if (shooter) {
        const imgBuf = await shooter.screenshot({
          captureBeyondViewport: false
        })
        msg = h.image(imgBuf, 'image/png')}
        page.close()
      return msg
      })}
