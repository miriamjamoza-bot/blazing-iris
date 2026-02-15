import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blazingiris.app',
  appName: '炽瞳·破界者',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0505',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  },
  android: {
    backgroundColor: '#0a0505'
  }
};

export default config;
