import { Asset } from 'expo-asset';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import { Appbar, Button, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import frameImages from './assets/frames';
import FrameSelectButtonGroup from './components/FrameSelectButtonGroup';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#c40000',
    accent: '#FAF408',
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerWithoutAvatar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    height: 250,
    width: 250,
    marginVertical: 16,
  },
  saveAndShareButtonView: {
    marginVertical: 16,
    flexDirection: 'row',
  },
});

export default function App() {
  const [selectedAvatar, setSelectedAvatar] = useState<{ uri: string; base64: string }>({ uri: '', base64: '' });
  const [frameIndex, setFrameIndex] = useState<number>(-1);

  const handleSelectAvatar = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('需要相册访问权限');
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (pickerResult.cancelled === true || pickerResult.type === 'video') {
      return;
    }
    setSelectedAvatar({ uri: pickerResult.uri, base64: pickerResult.base64! });
  };

  const handleCanvas = (canvas: Canvas) => {
    if (!(canvas instanceof Canvas)) {
      return;
    }

    canvas.height = 250;
    canvas.width = 250;
    const ctx = canvas.getContext('2d');
    ctx.restore();

    const image = new CanvasImage(canvas);
    image.src = `data:image/png;base64,${selectedAvatar.base64}`;
    image.addEventListener('load', () => {
      ctx.drawImage(image, 0, 0, 250, 250);
      const frame = new CanvasImage(canvas);
      frame.src = Asset.fromModule(frameImages[frameIndex]).uri;
      frame.addEventListener('load', () => {
        ctx.drawImage(frame, 0, 0, 250, 250);
      });
    });
  };

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header>
        <Appbar.Content title="国旗头像生成器" subtitle="上海市第八中学 孙烨阳" />
        <Appbar.Action icon="" />
        <Appbar.Action icon="information" />
      </Appbar.Header>
      {!!selectedAvatar.uri ? (
        <ScrollView>
          <View style={styles.container}>
            {frameIndex === -1 ? (
              <Image source={{ uri: selectedAvatar.uri }} style={styles.avatar} />
            ) : (
              <Canvas ref={handleCanvas} style={styles.avatar} />
            )}
            <View>
              <Button icon="camera" mode="contained" onPress={handleSelectAvatar}>
                更改头像
              </Button>
            </View>
            <View style={styles.saveAndShareButtonView}>
              <Button mode="contained" icon="content-save" style={{ marginRight: 8 }}>
                保存
              </Button>
              <Button mode="contained" icon="share-variant" style={{ marginLeft: 8 }}>
                分享
              </Button>
            </View>
            <FrameSelectButtonGroup onSelect={(img) => setFrameIndex(img)} />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.containerWithoutAvatar}>
          <Button icon="camera" mode="contained" onPress={handleSelectAvatar}>
            添加头像
          </Button>
        </View>
      )}
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
