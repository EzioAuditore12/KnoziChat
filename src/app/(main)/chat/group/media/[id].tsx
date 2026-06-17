import { Stack, useLocalSearchParams } from 'expo-router';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsTriggerText,
  TabsIndicator,
} from '@/components/ui/tabs';

import { useLiveGetGroupChatMedia } from '@/features/chat/group/hooks/database/use-live-get-group-chat-media';
import { useGroupMediaByDate } from '@/features/chat/direct/hooks/use-group-media-by-date';
import { MediaSectionList } from '@/features/chat/direct/components/media/media-section-list';
import { MediaListLoading } from '@/features/chat/components/loading/media-list-loading';

export default function GroupChatMediaScreen() {
  const { id } = useLocalSearchParams() as { id: string };

  const { data, fetchNextPage, isLoading } = useLiveGetGroupChatMedia({
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
