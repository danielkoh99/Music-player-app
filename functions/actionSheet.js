import { ActionSheetIOS } from 'react-native';
let RNFS = require('react-native-fs');

const actionSheet = url => {
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ['Cancel', 'Delete'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      userInterfaceStyle: 'dark',
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        // cancel action
      } else if (buttonIndex === 1) {
        RNFS.unlink(url);
        // return 'deleted';
      }
    },
  );
};
export { actionSheet };
