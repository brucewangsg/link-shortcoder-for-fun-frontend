import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Input, Icon } from 'antd';
import { API_HOST } from './config.js';
import axios from 'axios';

class App extends Component {
  state = {
    url: ''
  }

  onURLChanged(value) {
    this.setState({
      shortcode: null,
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

  checkLink() {
    if (this.state.url && this.state.url.length > 0) {
      let url = this.state.url;
      axios.get(`${API_HOST}/links/check?url=${encodeURIComponent(url)}`, { responseType: 'json' }).then((response) => {
        let jsonDetail = response.data;
        if (jsonDetail && jsonDetail.data && jsonDetail.data.shortcode) {
          if (jsonDetail.data.url == url.replace(/^https?:\/\//, '')) { 
            this.setState({
              shortcode: jsonDetail.data.shortcode
            })
          }
        }
      });
    }
  }

  submitURL() {
    if (this.state.url && this.state.url.length > 0) {
      let url = this.state.url;
      axios.post(`${API_HOST}/links`, { url: url }, { responseType: 'json' }).then((response) => {
        let jsonDetail = response.data;
        if (jsonDetail && jsonDetail.data && jsonDetail.data.shortcode) {
          if (jsonDetail.data.url == url.replace(/^https?:\/\//, '')) { 
            this.setState({
              shortcode: jsonDetail.data.shortcode
            })
          }
        }
      });
    }
  }

  debounce(func, time) {
    var timeout = this.debouncedTimeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    this.debouncedTimeout = setTimeout(function() {
      func();
      this.debouncedTimeout = null;
    }.bind(this), time);
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
          onChange={(e) => { this.onURLChanged(e.target.value); this.debounce(() => this.checkLink(), 280) }}
          onPressEnter={() => { this.normalizeURL(); this.submitURL(); } }
        />

        {this.state.shortcode && <div className='link-to'>
          <a target='_blank' href={`${API_HOST}/${this.state.shortcode}`}>{`${(API_HOST ? API_HOST : `${window.location.protocol}//${window.location.host}:${window.location.port}`).replace(/:80/, '')}/${this.state.shortcode}`}</a>
        </div>}
      </div>
    );
  }
}

export default App;
