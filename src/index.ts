// @ts-check
import { Context, Schema, h } from 'koishi'
import { } from 'koishi-plugin-puppeteer'

export const name = 'bilisearch'
export const inject = ['puppeteer']
export const usage = `
<p>指令「b站搜索」。</p>`


export interface Config { }

export const Config: Schema<Config> = Schema.object({})

// 这个是常量，不能放在里面，否则会一直创建
const types = ['视频', '番剧', '影视', '直播', '专栏', '用户', '综合']
const screens = ['最多播放','最多点击','最多评论','最多点击', '最新发布', '最多弹幕', '最多收藏', '最新开播','主播','直播间','直播间最新开播','粉丝由高到低','粉丝由低到高','等级由高到低','等级由低到高']
export function apply(ctx: Context) {
  ctx.command('bilibilisearch <keyword:string> [type:string] [screen:string]', 'b站搜索 搜索内容 (搜索类型) (搜索排序)')
    .alias('b站搜索')
    .usage('注意:搜索内容不可省去.\n搜索类型有:综合、视频、番剧、影视、直播、专栏、用户.\n搜索排序有:最多播放、最多点击、最多评论、最多弹幕、最多收藏、最新发布、最新开播、主播、\n直播间、直播间最新开播、粉丝由高到低、粉丝由低到高、等级由高到低、等级由低到高.\n视频类型排序有:最多播放、最新发布、、最多弹幕、最多收藏.\n番剧,影视类型无简单筛选\n直播类型排序有:最新开播、主播、直播间、直播间最新开播.\n专栏类型排序有:最新发布、最多点击、最多喜欢、最多评论.\n用户类型排序有:粉丝由高到低、粉丝由低到高、等级由高到低、等级由低到高.')
    .example('b站搜索 千代澪 综合 最多播放\n    b站搜索 千代澪 直播\n    b站搜索 千代澪')
    .action(async (_, keyword, type, screen) => {
      // 判断是否输入搜索内容
      if (!keyword) return '请输入搜索内容'

      switch (type) {
        /* case '':
          case '':
          type = ''; break */
        // 如果type没有输入就是undefiend，所以这里要加上undefined
        case undefined: 
        case '综合':
        case 'all':
          // 这里相当于不输入，输入综合或输入all类型都是all
          type = 'all'; break
        case '视频':
        case 'video':
          type = 'video'; break
        case '番剧':
        case 'bangumi':
          type = 'bangumi'; break
        case '影视':
        case 'pgc':
          type = 'pgc'; break
        case '直播':
        case 'live':
          type = 'live'; break
        case '专栏':
        case 'article':
          type = 'article'; break
        case '用户':
        case 'upuser':
          type = 'upuser'; break
        default: return '请输入正确的搜索类型'
      }


      switch (screen) {
        case undefined:
          screen = ''; break
        case 'order=click':
        case '最多播放':
        case '最多点击':
          screen = 'order=click'; break
        case 'order=attention':
        case '最多喜欢':
          screen = 'order=attention'; break
        case 'order=scores':
        case '最多评论':
          screen = 'order=scores'; break
        case 'order=pubdate':
        case '最新发布':
          screen = 'order=pubdate'; break
        case 'order=dm':
        case '最多弹幕':
          screen = 'order=dm'; break
        case 'order=stow':
        case '最多收藏':
          screen = 'order=stow'; break
        case 'order=live_time':
        case '最新开播':
          screen = 'order=live_time'; break
        case 'order=fans':
        case '粉丝由高到低':
          screen = 'order=fans'; break
        case 'order=fans&order_sort=1':
        case '粉丝由低到高':
          screen = 'order=fans&order_sort=1'; break
        case 'order=level':
        case '等级由高到低':
          screen = 'order=level'; break
        case 'order=level&order_sort=1':
        case '等级由低到高':
          screen = 'order=level&order_sort=1'; break
        case 'search_type=live_user':
        case '主播':
          screen = 'search_type=live_user'; break
        case 'search_type=live_room':
        case '直播间':
          screen = 'search_type=live_room'; break
        case 'search_type=live_room&order=live_time':
        case '直播间最新开播':
          screen = 'search_type=live_room&order=live_time'; break
        default: return '请输入正确的筛选类型'
      }

      const page = await ctx.puppeteer.page()
      await page.setViewport({
        width: 1440,
        height: 1320
      })

      // const url = `https://search.bilibili.com/${type}?keyword=${keyword + ('&') + bro}`
      // const 是常量不能修改，要改成 let
      let url = `https://search.bilibili.com/${type}?keyword=${keyword}`
      // 因为bro是可选的，所以要判断一下，如果有bro就加上
      screen && (url += ('&' + screen))
      // 这里可以打印看看url是否正确
      console.log(url);
      //return
      await page.goto(url, {
        waitUntil: 'networkidle2'
      })
      await page.addStyleTag({
        content: `
          div.bili-header {
            display: none !important
          }
        `
      })

      const shooter = page
      let msg: h | string
      if (shooter) {
        const imgBuf = await shooter.screenshot({
          captureBeyondViewport: false
        })
        msg = h.image(imgBuf, 'image/png')
      }
      page.close()
      return msg
    })
}
