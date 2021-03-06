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
import AboutDialog from './components/AboutDialog';
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
});

export default function App() {
  const [selectedAvatar, setSelectedAvatar] = useState<{ uri: string; base64: string }>({ uri: '', base64: '' });
  const [frameIndex, setFrameIndex] = useState<number>(-1);
  const [canvasResult, setCanvasResult] = useState<Canvas>();
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
    const frame = new CanvasImage(canvas);
    frame.crossOrigin = 'anonymous';

    image.src = `data:image/png;base64,${selectedAvatar.base64}`;
    image.addEventListener('load', async () => {
      const [{ localUri }] = await Asset.loadAsync(frameImages[frameIndex]);
      const frameBase64 = await FileSystem.readAsStringAsync(localUri!, { encoding: FileSystem.EncodingType.Base64 });
      frame.src = `data:image/png;base64,${frameBase64}`;
    });

    frame.addEventListener('load', () => {
      ctx.drawImage(image, 0, 0, 250, 250);
      ctx.drawImage(frame, 0, 0, 250, 250);
      setCanvasResult(canvas);
    });
  };

  const handleSaveImage = async () => {
    const canvasResultData = await canvasResult!.toDataURL();
    const imageBase64Result = canvasResultData.substring(23, canvasResultData.length - 1);
    const filename = `${FileSystem.documentDirectory}oct-1st-avatar.png`;
    await FileSystem.writeAsStringAsync(filename, imageBase64Result, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let permissionResult = await MediaLibrary.requestPermissionsAsync();
    if (permissionResult.granted === false) {
      setCameraPermissionError(true);
      return;
    }
    await MediaLibrary.saveToLibraryAsync(filename);
    setSaveAvatarSuccess(true);
  };

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header>
        <Appbar.Content title="????????????????????????" subtitle="????????????????????? ?????????" />
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
            <Button icon="camera" mode="contained" onPress={handleSelectAvatar} style={{ marginBottom: 16 }}>
              ???????????????
            </Button>
            {frameIndex !== -1 && (
              <Button mode="contained" icon="content-save" style={{ marginBottom: 16 }} onPress={handleSaveImage}>
                ????????????
              </Button>
            )}
            <FrameSelectButtonGroup onSelect={(img) => setFrameIndex(img)} />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.containerWithoutAvatar}>
          <Button icon="camera" mode="contained" onPress={handleSelectAvatar}>
            ????????????
          </Button>
        </View>
      )}
      <Snackbar
        visible={cameraPermissionError}
        onDismiss={() => setCameraPermissionError(false)}
        style={{ backgroundColor: '#d32f2f' }}
      >
        ????????????????????????
      </Snackbar>
      <Snackbar
        visible={saveAvatarSuccess}
        onDismiss={() => setSaveAvatarSuccess(false)}
        style={{ backgroundColor: '#2e7d32' }}
      >
        ????????????
      </Snackbar>
      <AboutDialog visible={showAboutDialog} onDismiss={() => setShowAboutDialog(false)} />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
