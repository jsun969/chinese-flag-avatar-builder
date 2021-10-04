import React from 'react';
import { Linking } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';

interface AboutDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ visible, onDismiss }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>关于</Dialog.Title>
        <Dialog.Content>
          <Paragraph>第十二届上海市青少年计算机应用操作竞赛参赛作品</Paragraph>
          <Paragraph>作者: 上海市第八中学 高二5班 孙烨阳</Paragraph>
          <Paragraph>技术栈: React Native</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => Linking.openURL('https://github.com/jsun969/chinese-flag-avatar-builder')}>Github仓库</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AboutDialog;
