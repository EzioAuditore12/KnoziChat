import { Stack, useLocalSearchParams } from 'expo-router';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsTriggerText,
  TabsIndicator,
} from '@/components/ui/tabs';

import { useLiveGetGroupChatMedia } from '@/features/chat/hooks/database/use-live-get-group-chat-media';
import { useGroupMediaByDate } from '@/features/chat/hooks/use-group-media-by-date';
import { MediaSectionList } from '@/features/chat/components/direct/media/media-section-list';

export default function GroupChatMediaScreen() {
  const { id } = useLocalSearchParams() as { id: string };

  const { data, fetchNextPage } = useLiveGetGroupChatMedia({
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
          <MediaSectionList sections={groupedData} onEndReached={fetchNextPage} />
        </TabsContent>
      </Tabs>
    </>
  );
}
