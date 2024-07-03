import { useEffect, useRef } from 'react'
import { JSONEditor, JSONEditorPropsOptional } from 'vanilla-jsoneditor'

export function JSONEditorPanel(props){
  const refContainer = useRef(null)
  const refEditor = useRef(null)

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {}
    })

    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy()
        refEditor.current = null
      }
    }
  }, [])

  // update props
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps(props)
    }
  }, [props])

  return <div ref={refContainer} />
}