// camera.tsx
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from "react-native";
import React, { useState, useRef, useContext } from "react";
import {
    Camera,
    CameraMode,
    CameraType,
    CameraView,
    useCameraPermissions,
} from "expo-camera";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { AntDesign, Feather, FontAwesome6 } from "@expo/vector-icons";
import { ImageContext } from "@/context/ImageContext";
import { Image, type ImageSource } from "expo-image";

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | null>(null);
    const [facing, setFacing] = useState<CameraType>("back");
    const { setSelectedImage } = useContext(ImageContext);

    const router = useRouter();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} label="Grant Permission" />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing((prev) => (prev === "back" ? "front" : "back"));
    };

    // const takePicture = async () => {
    //     if (cameraRef.current) {
    //         const photo = await cameraRef.current.takePictureAsync();
    //         // Navigate to processed-text screen with the captured photo URI
    //         router.push({
    //             pathname: "/processed-text",
    //             params: { imageUri: photo.uri },
    //         });
    //     }
    // };
    const takePicture = async () => {
        const photo = await cameraRef.current?.takePictureAsync();
        console.log(photo);
        if (photo?.uri) {
            setUri(photo.uri);
            // Update the shared context with the captured image
            setSelectedImage(photo);
            // Optionally, navigate to the processed-text screen immediately:
            // router.back();
        }
    };

    const renderPicture = () => {
        return (
            <View style={styles.container}>
                <Image
                    source={{ uri }}
                    contentFit="contain"
                    style={{ width: 300, aspectRatio: 1 }}
                />
                <Button
                    onPress={() => setUri(null)}
                    label="Take another picture"
                />
                {/* <Image source={imageSource} style={styles.image} />; */}
            </View>
        );
    };

    const renderCamera = () => {
        return (
            <CameraView
                style={styles.camera}
                ref={cameraRef}
                facing={facing}
                mute={false}
                responsiveOrientationWhenOrientationLocked
            >
                <View style={styles.shutterContainer}>
                    {/* <Pressable onPress={toggleMode}>
                        {mode === "picture" ? (
                            <AntDesign name="picture" size={32} color="white" />
                        ) : (
                            <Feather name="video" size={32} color="white" />
                        )}
                    </Pressable> */}
                    <Pressable onPress={takePicture}>
                        {({ pressed }) => (
                            <View
                                style={[
                                    styles.shutterBtn,
                                    {
                                        opacity: pressed ? 0.5 : 1,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.shutterBtnInner,
                                        {
                                            backgroundColor: "white",
                                        },
                                    ]}
                                />
                            </View>
                        )}
                    </Pressable>
                    <Pressable onPress={toggleCameraFacing}>
                        <FontAwesome6
                            name="rotate-left"
                            size={32}
                            color="white"
                        />
                    </Pressable>
                </View>
            </CameraView>
        );
    };

    return (
        <View style={styles.container}>
            {uri ? renderPicture() : renderCamera()}
        </View>
    );

    // return (
    //     <View style={styles.container}>
    //         <Camera style={styles.camera} type={facing} ref={cameraRef}>
    //             <View style={styles.buttonContainer}>
    //                 <TouchableOpacity
    //                     style={styles.button}
    //                     onPress={toggleCameraFacing}
    //                 >
    //                     <Text style={styles.text}>Flip Camera</Text>
    //                 </TouchableOpacity>
    //                 <TouchableOpacity
    //                     style={styles.button}
    //                     onPress={takePicture}
    //                 >
    //                     <Text style={styles.text}>Capture</Text>
    //                 </TouchableOpacity>
    //             </View>
    //         </Camera>
    //     </View>
    // );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     message: {
//         textAlign: "center",
//         paddingBottom: 10,
//     },
//     camera: {
//         flex: 1,
//     },
//     buttonContainer: {
//         flex: 1,
//         flexDirection: "row",
//         backgroundColor: "transparent",
//         margin: 64,
//         justifyContent: "space-between",
//         alignItems: "flex-end",
//     },
//     button: {
//         backgroundColor: "rgba(0,0,0,0.5)",
//         padding: 10,
//         borderRadius: 5,
//     },
//     text: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "white",
//     },
// });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
        justifyContent: "center",
    },
    camera: {
        flex: 1,
        width: "100%",
    },
    shutterContainer: {
        position: "absolute",
        bottom: 44,
        left: 0,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
    },
    shutterBtn: {
        backgroundColor: "transparent",
        borderWidth: 5,
        borderColor: "white",
        width: 85,
        height: 85,
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
    },
    shutterBtnInner: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
});
