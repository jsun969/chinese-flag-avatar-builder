import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  root: {
    marginBottom: 8,
    marginRight: 8,
    borderRadius: 4,
    borderColor: '#FAF408',
    padding: 4,
  },
});

interface FrameSelectButtonProps {
  image: any;
  onPress: () => void;
}

const FrameSelectButton: React.FC<FrameSelectButtonProps> = ({ image, onPress }) => {
  return (
    <TouchableOpacity style={{ ...styles.root }} onPress={onPress}>
      <Image source={image} style={{ height: 50, width: 50 }} />
    </TouchableOpacity>
  );
};

export default FrameSelectButton;
