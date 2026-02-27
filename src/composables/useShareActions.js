import { ref } from 'vue';

export const useShareActions = () => {
  const isShareDialogOpen = ref(false);
  const shareStatusMessage = ref('');

  const openShareDialog = () => {
    shareStatusMessage.value = '';
    isShareDialogOpen.value = true;
  };

  const closeShareDialog = () => {
    isShareDialogOpen.value = false;
  };

  const shareCurrentResult = async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'micro-corp Simulation',
          text: 'FIRE後の社会保険料シミュレーター',
          url: shareUrl,
        });
        shareStatusMessage.value = '共有ダイアログを開きました。';
        closeShareDialog();
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      shareStatusMessage.value = '共有URLをコピーしました。';
      closeShareDialog();
    } catch {
      shareStatusMessage.value = '共有またはコピーに失敗しました。時間をおいて再度お試しください。';
    }
  };

  return {
    isShareDialogOpen,
    shareStatusMessage,
    openShareDialog,
    closeShareDialog,
    shareCurrentResult,
  };
};
