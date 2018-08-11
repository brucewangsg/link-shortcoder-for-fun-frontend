import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Input, Icon } from 'antd';

class App extends Component {
  state = {
    url: ''
  }

  onURLChanged(value) {
    this.setState({
      url: value
    })
    if (document.activeElement && !document.activeElement.classList.contains("ant-input")) {
      this.normalizeURL()
    }
  }

  normalizeURL() {
    if (this.state.url && this.state.url.indexOf('.') > 0 && this.state.url.indexOf('://') < 0) {
      this.setState({
        url: 'https://' + this.state.url
      })
    }
  }

  render() {
    return (
      <div className="App">
        <h2>Shorten URL:</h2>
        <Input
          addonBefore="Link:"
          placeholder="e.g. google.com"
          prefix={<Icon type="star" style={{ color: 'rgba(0,0,0,.25)' }} />}
          value={this.state.url}
          className="ant--input"
          onChange={(e) => this.onURLChanged(e.target.value)}
          onBlur={() => this.normalizeURL()}
          onPressEnter={() => this.normalizeURL()}
        />
      </div>
    );
  }
}

export default App;
