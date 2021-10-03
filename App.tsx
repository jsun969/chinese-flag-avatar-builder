import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
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
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');

  const handleSelectAvatar = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('需要相册访问权限');
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    setSelectedAvatar(pickerResult.uri);
  };

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header>
        <Appbar.Content title="国旗头像生成器" subtitle="上海市第八中学 孙烨阳" />
        <Appbar.Action icon="" />
        <Appbar.Action icon="information" />
      </Appbar.Header>
      {!!selectedAvatar ? (
        <ScrollView>
          <View style={styles.container}>
            <Image source={{ uri: selectedAvatar }} style={styles.avatar} />
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
            <FrameSelectButtonGroup onSelect={(img) => alert(img)} />
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
