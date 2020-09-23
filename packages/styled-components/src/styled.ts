/* eslint-disable no-continue, no-loop-func, no-cond-assign */
import * as React from 'react'
import scStyled, {
  ThemedStyledFunction,
  StyledConfig,
  ThemedBaseStyledInterface,
  DefaultTheme,
} from 'styled-components'
import { createBox } from '@xstyled/core'
import {
  createSystemComponent,
  SystemProps,
  ComponentWithAs,
} from '@xstyled/system'
import { css } from './css'
import { BoxElements } from './types'

function getCreateStyle(baseCreateStyle: ThemedStyledFunction<any, any>) {
  // @ts-ignore
  const createStyle = (...args: any) => baseCreateStyle`${css(...args)}`
  createStyle.attrs = (attrs: any) => {
    const nextCreateStyle = baseCreateStyle.attrs(attrs)
    return getCreateStyle(nextCreateStyle)
  }
  createStyle.withConfig = (config: StyledConfig<any>) => {
    const nextCreateStyle = baseCreateStyle.withConfig(config)
    return getCreateStyle(nextCreateStyle)
  }
  return createStyle
}

type ThemedXStyledComponentFactories<T extends object> = {
  [Key in keyof BoxElements]: ThemedStyledFunction<
    ComponentWithAs<SystemProps<T>, BoxElements[Key]>,
    T,
    SystemProps<T>
  >
}

interface ThemeBaseXStyledInterface<T extends object>
  extends ThemedBaseStyledInterface<T>,
    ThemedXStyledComponentFactories<T> {}

type XStyledInterface = ThemeBaseXStyledInterface<DefaultTheme>

export const styled = <XStyledInterface>((component: any) => {
  return getCreateStyle(scStyled(component))
})

const InnerBox = createSystemComponent<DefaultTheme>(React)

export const Box = styled(InnerBox)(createBox)

// @ts-ignore
styled.box = styled(Box)

Object.keys(scStyled).forEach((key) => {
  // @ts-ignore
  styled[key] = styled(key)
  // @ts-ignore
  styled[`${key}Box`] = styled(
    // @ts-ignore
    Box.withComponent(createSystemComponent<DefaultTheme>(React, key)),
  )
})
