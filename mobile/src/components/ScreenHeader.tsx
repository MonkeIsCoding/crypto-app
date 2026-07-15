import React from "react";
import { Text } from "react-native";
import { useThemeClasses } from "../theme/classes";

interface Props {
  title: string;
  offline?: boolean;
  offlineMessage?: string;
}

export function ScreenHeader({ title, offline = false, offlineMessage = "Offline — showing last synced data" }: Props) {
  const { inkText, banner } = useThemeClasses();

  return (
    <>
      <Text className={`font-sans-extrabold text-[28px] ${inkText} px-4 mt-2 mb-2`}>{title}</Text>
      {offline && (
        <Text className={`${banner} text-center p-1.5 text-xs font-sans-medium`}>{offlineMessage}</Text>
      )}
    </>
  );
}
