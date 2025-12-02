import { useMutation } from '@pinia/colada';

import { MessageApi } from '../api/message.api';

export const useSendMessageMutation = () =>
  useMutation({
    mutation: MessageApi.send
  });
