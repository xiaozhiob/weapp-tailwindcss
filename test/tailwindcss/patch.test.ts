import { findAstNode, getInstalledPkgJsonPath, internalPatch } from '@/tailwindcss/patcher'
import { tailwindcssCasePath, createGetCase } from '#test/util'
import { getOptions } from '@/defaults'
import path from 'path'
import type { ILengthUnitsPatchOptions } from '@/types'
const getCase = createGetCase(tailwindcssCasePath)
describe('tailwindcss source code patch', () => {
  it('getInstalledPkgJsonPath case 0', () => {
    const options = getOptions()
    // @ts-ignore
    const p = getInstalledPkgJsonPath(options.supportCustomLengthUnitsPatch)
    expect(p).toContain('tailwindcss')
    expect(p).toContain('node_modules')
  })

  it('findAstNode case 0', async () => {
    const options = getOptions()
    // @ts-ignore
    const content = await getCase(options.supportCustomLengthUnitsPatch.dangerousOptions.lengthUnitsFilePath)
    // @ts-ignore
    const { arrayRef, changed } = findAstNode(content, options.supportCustomLengthUnitsPatch)
    expect(arrayRef).toBeTruthy()
    expect(changed).toBe(true)
  })

  it('internalPatch case 0', () => {
    const options = getOptions()

    const opt = options.supportCustomLengthUnitsPatch as Required<ILengthUnitsPatchOptions>
    opt.dangerousOptions.overwrite = false
    const code = internalPatch(path.resolve(tailwindcssCasePath, 'package.json'), opt)
    expect(code).toMatchSnapshot()
  })
})
