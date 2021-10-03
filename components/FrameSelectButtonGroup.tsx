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

interface FrameSelectButtonGroupProps {
  onSelect: (img: number) => void;
}

const FrameSelectButtonGroup: React.FC<FrameSelectButtonGroupProps> = ({ onSelect }) => {
  return (
    <View style={styles.ButtonGroupView}>
      {frameImages.map((img, index) => (
        <FrameSelectButton image={img} onPress={() => onSelect(index)} key={index} />
      ))}
    </View>
  );
};

export default FrameSelectButtonGroup;
