import { ref } from 'vue';
import { buildConditionsAndAlgorithmJson } from '../domain/export.js';
import { RATES, REMUNERATION_TABLE } from '../data/rates.js';

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
          title: 'マイクロ法人シミュレーション',
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

  const copyConditionsAndAlgorithm = (params, results) => {
    const data = buildConditionsAndAlgorithmJson(params, results, RATES, REMUNERATION_TABLE);
    return JSON.stringify(data, null, 2);
  };

  return {
    isShareDialogOpen,
    shareStatusMessage,
    openShareDialog,
    closeShareDialog,
    shareCurrentResult,
    copyConditionsAndAlgorithm,
  };
};
