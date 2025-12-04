import { useMutation, useQueryCache } from '@pinia/colada';

import { ChatApi } from '../api/chat.api';

export const useCreateDirectChatMutation = () => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: ChatApi.createDirect,
    onSuccess: data => {}
  });
};
