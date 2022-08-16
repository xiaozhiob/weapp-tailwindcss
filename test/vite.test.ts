import * as vite from 'vite'
import type { RollupOutput } from 'rollup'
import vwt from '@/framework/vite/index'
import postcssWeappTailwindcssRename from '@/postcss/plugin'
import path from 'path'
describe('vite test', () => {
  it('vite common build', async () => {
    // 注意： 打包成 h5 和 app 都不需要开启插件配置
    const isH5 = process.env.UNI_PLATFORM === 'h5'
    const isApp = process.env.UNI_PLATFORM === 'app'
    const WeappTailwindcssDisabled = isH5 || isApp

    // vite 插件配置
    const vitePlugins = []
    // postcss 插件配置
    const postcssPlugins = [
      require('autoprefixer')(),
      require('tailwindcss')({
        config: path.resolve(__dirname, './config/tailwind.config.js')
      })
    ]
    if (!WeappTailwindcssDisabled) {
      vitePlugins.push(vwt())

      postcssPlugins.push(
        require('postcss-rem-to-responsive-pixel')({
          rootValue: 32,
          propList: ['*'],
          transformUnit: 'rpx'
        })
      )
      postcssPlugins.push(postcssWeappTailwindcssRename({}))
    }

    const res = (await vite.build({
      root: path.resolve(__dirname, './fixtures/vite'),
      plugins: vitePlugins,

      css: {
        postcss: {
          plugins: postcssPlugins
        }
      },
      build: {
        write: false
      }
    })) as RollupOutput
    expect(res.output).toMatchSnapshot()
  })
})