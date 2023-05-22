/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import CookieManager from '@react-native-cookies/cookies';
import React, {useRef, useState} from 'react';
import {Button, SafeAreaView, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

const uri = 'http://localhost:3000';

function App(): JSX.Element {
  let webviewRef = useRef<WebView>();

  /** webview 로딩 완료시 */
  const handleEndLoading = () => {
    console.log('webview loaded');
    if (!isReloaded) {
      webviewRef.current?.reload();
      setIsReloaded(true);
    }
    webviewRef.current?.postMessage(JSON.stringify({type: 'loaded'}));
  };

  /** 웹뷰에서 rn으로 보낸 메시지를 수신합니다. */
  const handleOnMessage = ({nativeEvent: {data}}) => {
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    console.log(data);
    try {
      const {type, message} = JSON.parse(data);
      console.log(type, message);
      if (type === 'BEARER_TOKEN') {
        CookieManager.set(uri, {
          name: 'BEARER_TOKEN',
          value: message,
        }).then(done => {
          console.log('CookieManager.set =>', done);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [isReloaded, setIsReloaded] = useState(false);

  const handleConsoleCookie = () => {
    CookieManager.get(uri).then(cookies => {
      console.log('CookieManager.get =>', cookies);
    });
  };

  const handleLogout = () => {
    CookieManager.clearByName(uri, 'BEARER_TOKEN').then(done => {
      console.log('CookieManager.clearByName =>', done);
      webviewRef.current?.postMessage(JSON.stringify({type: 'LOGOUT'}));
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <Button
        onPress={handleConsoleCookie}
        title="Console Cookie"
        color="#841584"
      />
      <Button onPress={handleLogout} title="Reset Cookie" color="red" />
      <WebView
        ref={ref => {
          if (!ref) return;
          webviewRef.current = ref;
        }}
        source={{uri}}
        onLoadEnd={handleEndLoading}
        onMessage={handleOnMessage}
        style={{flex: 1}}
        onContentProcessDidTerminate={() => {
          webviewRef.current?.reload();
        }}
        originWhitelist={['*']}
        bounces={false}
        domStorageEnabled
        onShouldStartLoadWithRequest={request => {
          return request.url.startsWith('http');
        }}
        javaScriptEnabled={true}
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
      />
    </SafeAreaView>
  );
}

export default App;
