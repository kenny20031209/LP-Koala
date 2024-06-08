
import '@wangeditor/editor/dist/css/style.css' // import css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { i18nChangeLanguage } from '@wangeditor/editor'
import {ImageElement, InsertFnType, InsertFnTypeVideo} from "@/type";
import { Boot } from '@wangeditor/editor'
import attachmentModule from '@wangeditor/plugin-upload-attachment'

Boot.registerModule(attachmentModule)

interface CustomEditorProps {
    onUpdate: (content:string) => void
}
function CustomEditor({onUpdate}:CustomEditorProps) {

    i18nChangeLanguage('en');
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    const [html, setHtml] = useState('');

    const toolbarConfig: Partial<IToolbarConfig> = {
        excludeKeys: [
            'insertLink',
            'insertImage',
            'insertVideo'
        ],
        insertKeys: {
            index: 21,
            keys: ['uploadAttachment'],
        },
    }

    const editorConfig: Partial<IEditorConfig> = {
        hoverbarKeys: {
            attachment: {
                menuKeys: ['downloadAttachment'], // “下载附件”菜单
            },
        },
        placeholder: 'Type here...',
        MENU_CONF: {}
    }

    function customCheckImageFn(src: string, alt: string, url: string): boolean | undefined | string {
        if (!src) {
            return
        }
        if (src.indexOf('http') !== 0) {
            return 'Image src must start width http/https'
        }
        return true
    }

    function customParseImageSrc(src: string): string {
        if (src.indexOf('http') !== 0) {
            return `http://${src}`
        }
        return src
    }

    if (editorConfig.MENU_CONF !== undefined) {

        editorConfig.MENU_CONF['insertImage'] = {
            onInsertedImage(imageNode: ImageElement | null) {
                if (imageNode == null) return

                const {src, alt, url, href} = imageNode
                console.log('inserted image', src, alt, url, href)
            },
            checkImage: customCheckImageFn,
            parseImageSrc: customParseImageSrc,
        }
        editorConfig.MENU_CONF['editImage'] = {
            onUpdatedImage(imageNode: ImageElement | null) {
                if (imageNode == null) return

                const {src, alt, url} = imageNode
                console.log('updated image', src, alt, url)
            },
            checkImage: customCheckImageFn, // support `async function`
            parseImageSrc: customParseImageSrc, // support `async function`
        }
        editorConfig.MENU_CONF['uploadImage'] = {
            allowedFileTypes: [],
            async customUpload(file: File, insertFn: InsertFnType) {   // TS syntax

                // `file` is your selected file

                // upload images yourself, and get image's url, alt, href
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch("https://lp-koala-backend-c0a69db0f618.herokuapp.com/test/file/upload", {
                    method: 'POST',
                    body: formData,
                })

                const data = await response.json();
                // TODO: deal with other file type here
                const imageUrl = `https://lp-koala-backend-c0a69db0f618.herokuapp.com/test/file/${data.fileId}`
                // insert image
                insertFn(imageUrl, file.name, imageUrl);
            }

        }
        editorConfig.MENU_CONF['uploadVideo'] = {
            // menu config...
            async customUpload(file: File, insertFn: InsertFnTypeVideo) {

                // `file` is your selected file

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch("https://lp-koala-backend-c0a69db0f618.herokuapp.com/test/file/upload", {
                    method: 'POST',
                    body: formData,
                })

                const data = await response.json();
                // upload videos yourself, and get video's url and poster
                const videoUrl = `https://lp-koala-backend-c0a69db0f618.herokuapp.com/test/file/${data.fileId}`

                // insert video
                insertFn(videoUrl, '')
            }
        }
        editorConfig.MENU_CONF['uploadAttachment'] = {
            allowedFileTypes: ['.pdf', '.doc', '.docx'],
            async customUpload(file: File, insertFn: Function) {
                // `file` is your selected file

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch("https://lp-koala-backend-c0a69db0f618.herokuapp.com/test/file/upload", {
                    method: 'POST',
                    body: formData,
                })

                const data = await response.json();
                // upload videos yourself, and get video's url and poster
                const fileUrl = `https://lp-koala-backend-c0a69db0f618.herokuapp.com/test/file/${data.fileId}`

                // insert file
                insertFn(file.name, fileUrl);
            },
        }

    }
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    return (
        <div className='h-1/2'>
            <div style={{ border: '1px solid #ccc', zIndex: 100}}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={editor => {
                        setHtml(editor.getHtml())
                        onUpdate(editor.getHtml())
                    }}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                />
            </div>

        </div>
    )
}

export default CustomEditor;