import './index.css'
import { hydrate } from 'preact'
import { Default } from './default'

// Quick hack to wrap default component around the content
hydrate(<Default>_</Default>, document.getElementById('main') as HTMLElement)
