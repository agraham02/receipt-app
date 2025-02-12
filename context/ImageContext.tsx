// context/ImageContext.tsx
import React, { createContext, useState, ReactNode } from "react";
import { Image, type ImageSource } from "expo-image";

interface ImageContextType {
    selectedImage?: ImageSource;
    setSelectedImage: (image?: ImageSource) => void;
}

export const ImageContext = createContext<ImageContextType>({
    selectedImage: undefined,
    setSelectedImage: () => {},
});

export const ImageProvider = ({ children }: { children: ReactNode }) => {
    const [selectedImage, setSelectedImage] = useState<ImageSource | undefined>(
        undefined
    );

    return (
        <ImageContext.Provider value={{ selectedImage, setSelectedImage }}>
            {children}
        </ImageContext.Provider>
    );
};
