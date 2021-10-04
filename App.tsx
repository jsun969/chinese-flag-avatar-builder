import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import { Appbar, Button, DefaultTheme, Provider as PaperProvider, Snackbar } from 'react-native-paper';
import frameImages from './assets/frames';
import FrameSelectButtonGroup from './components/FrameSelectButtonGroup';
import AboutDialog from './components/AboutDialog';

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
});

export default function App() {
  const [selectedAvatar, setSelectedAvatar] = useState<{ uri: string; base64: string }>({ uri: '', base64: '' });
  const [frameIndex, setFrameIndex] = useState<number>(-1);
  const [avatarResult, setAvatarResult] = useState<string>('');
  const [cameraPermissionError, setCameraPermissionError] = useState<boolean>(false);
  const [saveAvatarSuccess, setSaveAvatarSuccess] = useState<boolean>(false);
  const [showAboutDialog, setShowAboutDialog] = useState<boolean>(false);

  const handleSelectAvatar = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      setCameraPermissionError(true);
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
    image.crossOrigin = 'anonymous';
    image.src = `data:image/png;base64,${selectedAvatar.base64}`;
    image.addEventListener('load', async () => {
      ctx.drawImage(image, 0, 0, 250, 250);
      const frame = new CanvasImage(canvas);
      frame.crossOrigin = 'anonymous';
      const [{ localUri }] = await Asset.loadAsync(frameImages[frameIndex]);
      const frameBase64 = await FileSystem.readAsStringAsync(localUri!, { encoding: FileSystem.EncodingType.Base64 });
      frame.src = `data:image/png;base64,${frameBase64}`;
      frame.addEventListener('load', async () => {
        ctx.drawImage(frame, 0, 0, 250, 250);
        const canvasResult = await canvas.toDataURL();
        const imageBase64Result = canvasResult.substring(23, canvasResult.length - 1);
        setAvatarResult(imageBase64Result);
      });
    });
  };

  const handleSaveImage = async () => {
    const filename = `${FileSystem.documentDirectory}oct-1st-avatar.png`;
    await FileSystem.writeAsStringAsync(filename, avatarResult, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await MediaLibrary.saveToLibraryAsync(filename);
    setSaveAvatarSuccess(true);
  };

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header>
        <Appbar.Content title="庆国庆头像生成器" subtitle="上海市第八中学 孙烨阳" />
        <Appbar.Action icon="" />
        <Appbar.Action icon="information" onPress={() => setShowAboutDialog(true)} />
      </Appbar.Header>
      {!!selectedAvatar.uri ? (
        <ScrollView>
          <View style={styles.container}>
            {frameIndex === -1 ? (
              <Image source={{ uri: selectedAvatar.uri }} style={styles.avatar} />
            ) : (
              <Canvas ref={handleCanvas} style={styles.avatar} />
            )}
            <Button icon="camera" mode="contained" onPress={handleSelectAvatar}>
              更改源头像
            </Button>
            <Button mode="contained" icon="content-save" style={{ marginVertical: 16 }} onPress={handleSaveImage}>
              保存头像
            </Button>
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
      <Snackbar
        visible={cameraPermissionError}
        onDismiss={() => setCameraPermissionError(false)}
        style={{ backgroundColor: '#d32f2f' }}
      >
        需要相册访问权限
      </Snackbar>
      <Snackbar
        visible={saveAvatarSuccess}
        onDismiss={() => setSaveAvatarSuccess(false)}
        style={{ backgroundColor: '#2e7d32' }}
      >
        保存成功
      </Snackbar>
      <AboutDialog visible={showAboutDialog} onDismiss={() => setShowAboutDialog(false)} />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
