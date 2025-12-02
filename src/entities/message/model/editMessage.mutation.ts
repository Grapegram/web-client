import { useMutation } from '@pinia/colada';

import { MessageApi } from '../api/message.api';

export const useEditMessageMutation = () =>
  useMutation({
    mutation: MessageApi.edit
  });
