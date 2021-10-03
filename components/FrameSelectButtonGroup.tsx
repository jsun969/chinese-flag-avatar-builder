import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import frameImages from '../assets/frames';
import FrameSelectButton from './FrameSelectButton';

const styles = StyleSheet.create({
  ButtonGroupView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

const FrameSelectButtonGroup: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<any>();

  return (
    <View style={styles.ButtonGroupView}>
      {frameImages.map((img, index) => (
        <FrameSelectButton image={img} onPress={() => setSelectedIndex(img)} key={index} />
      ))}
    </View>
  );
};

export default FrameSelectButtonGroup;
