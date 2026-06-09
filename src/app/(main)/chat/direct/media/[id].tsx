import { Stack, useLocalSearchParams } from 'expo-router';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsTriggerText,
  TabsIndicator,
} from '@/components/ui/tabs';

import { useLiveGetDirectChatMedia } from '@/features/chat/hooks/database/use-live-get-direct-chat-media';
import { useGroupMediaByDate } from '@/features/chat/hooks/use-group-media-by-date';
import { MediaSectionList } from '@/features/chat/components/direct/media/media-section-list';
import { MediaListLoading } from '@/features/chat/components/loading/media-list-loading';

export default function DirectChatMediaScreen() {
  const { id } = useLocalSearchParams() as { id: string };

  const { data, fetchNextPage, isLoading } = useLiveGetDirectChatMedia({
    id,
    pageSize: 20,
  });

  const groupedData = useGroupMediaByDate(data);

  return (
    <>
      <Stack.Screen options={{ title: 'All media' }} />
      <Tabs defaultValue="tab1" className="flex-1">
        <TabsList>
          <TabsTrigger value="tab1">
            <TabsTriggerText>Media</TabsTriggerText>
          </TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="tab1" className="flex-1">
          {isLoading ? (
            <MediaListLoading />
          ) : (
            <MediaSectionList sections={groupedData} onEndReached={fetchNextPage} />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
