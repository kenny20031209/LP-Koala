

import { SlateElement } from '@wangeditor/editor'

export type ImageElement = SlateElement & {
    src: string
    alt: string
    url: string
    href: string
}

export type InsertFnType = (url: string, alt: string, href: string) => void
export type InsertFnTypeVideo = (url: string, poster: string) => void

export type Project = {
    _id: string,
    title: string,
    image: string,
    researchers: string[],
    raters: string[]

}
export type Activity = {
    _id: string,
    description: string,
    content: string,
}
export type Thread = {
    _id: string,
    title: string,
    description: string,
}