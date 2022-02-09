import { Share } from 'react-native';

const onShare = async item => {
  try {
    const result = await Share.share({
      message: 'Share ' + item.title,
      url: item.url,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      return;
    }
  } catch (error) {
    alert(error.message);
  }
};

export default onShare;
