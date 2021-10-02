import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Appbar, Button, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

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
  avatar: {
    height: 250,
    width: 250,
    marginVertical: 16,
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
        <Appbar.Action icon="" />
      </Appbar.Header>
      <View style={styles.container}>
        {!!selectedAvatar && <Image source={{ uri: selectedAvatar }} style={styles.avatar} />}
        <Button icon="camera" mode="contained" onPress={handleSelectAvatar}>
          添加图片
        </Button>
      </View>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
