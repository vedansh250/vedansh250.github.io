import React, { Component, type ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

class Root extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeContent: 'center', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
        <p>Something went wrong while drawing this page.</p>
        <button className="btn btn-ghost" onClick={() => window.location.reload()}>RELOAD PAGE</button>
      </div>
    )
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root><App /></Root>
  </React.StrictMode>,
)
