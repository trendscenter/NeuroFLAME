// src/types/custom.d.ts
declare module '*.svg' {
    const content: string;
    export default content;
  }

declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}
  