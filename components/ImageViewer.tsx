import { StyleSheet } from "react-native";
import { Image, type ImageSource } from "expo-image";

type Props = {
    imgSource: ImageSource;
    selectedImage?: ImageSource;
};

export default function ImageViewer({ imgSource, selectedImage }: Props) {
    const imageSource = selectedImage || imgSource;

    return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
        borderColor: "red",
        borderWidth: 2,
    },
});
