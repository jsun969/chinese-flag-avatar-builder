import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  root: {
    marginBottom: 8,
    marginRight: 8,
    borderRadius: 4,
    borderColor: '#c40000',
  },
  unselected: {
    padding: 4,
    borderWidth: 1,
  },
  selected: {
    padding: 2,
    borderWidth: 3,
  },
});

interface FrameSelectButtonProps {
  image: any;
  selected: boolean;
  onPress: () => void;
}

const FrameSelectButton: React.FC<FrameSelectButtonProps> = ({ image, selected, onPress }) => {
  return (
    <TouchableOpacity style={{ ...styles.root, ...(selected ? styles.selected : styles.unselected) }} onPress={onPress}>
      <Image source={image} style={{ height: 50, width: 50 }} />
    </TouchableOpacity>
  );
};

export default FrameSelectButton;
