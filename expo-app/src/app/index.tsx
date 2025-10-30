import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Link, LinkText } from '@/components/ui/link';

export default function HomeScreen() {
  return (
    <Center className='p-2 flex-1 bg-red-500'>
      <Heading>Hello Index Screen</Heading>

      <Link href={'/settings'}>
        <LinkText>Seetings</LinkText>
      </Link>

      <Input className='w-full border-2 mt-3 border-white'/>

      <Button className='w-full mt-3'>
        <ButtonText>Hello</ButtonText>
      </Button>

    </Center>
  );
}
